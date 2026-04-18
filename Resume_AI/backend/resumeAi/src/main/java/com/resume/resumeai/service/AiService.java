package com.resume.resumeai.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.resume.resumeai.domain.dto.ai.*;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.model.ChatResponse;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 基于 Spring AI 的后端 AI 服务
 */
@Service
public class AiService {
    private static final Logger log = LoggerFactory.getLogger(AiService.class);
    private final ChatClient chatClient;
    private final ObjectMapper mapper;

    public AiService(ChatClient.Builder chatClientBuilder, ObjectMapper mapper) {
        this.chatClient = chatClientBuilder.build();
        this.mapper = mapper;
    }

    /**
     * 清洗模型返回的 JSON 文本，移除 Markdown 代码块围栏与语言标记。
     * 适配形态：```json { ... } ```、``` { ... } ```、前缀为"json\n"。
     */
    private String sanitizeJson(String s) {
        if (s == null) return null;
        String t = s.trim();
        t = t.replaceFirst("(?s)^```(?:json)?\\s*", "");
        t = t.replaceFirst("(?s)\\s*```$", "");
        t = t.replaceFirst("(?is)^json\\s*", "");
        return t.trim();
    }

    /**
     * 简历润色
     */
    public ResumePolishResponse polish(ResumePolishRequest req) {
        String language = req.getLanguage() == null ? "zh" : req.getLanguage();
        String sys = "你是资深简历顾问，面向" + (req.getIndustry() == null ? "通用行业" : req.getIndustry()) +
                "的" + (req.getRole() == null ? "岗位" : req.getRole()) + "，请在保持事实的前提下优化语法与表达。" +
                "以" + ("zh".equalsIgnoreCase(language) ? "中文" : "英文") + "输出。";

        String instruction = "请严格输出 JSON：{\n  \"polished_text\": string\n}";
        String content = "原始简历：\n" + req.getText() + "\n\n" + instruction;

        String json = chatClient
                .prompt()
                .system(sys)
                .user(content)
                .call()
                .content();
        json = sanitizeJson(json);
        log.debug("polish response: {}", json);
        try {
            ResumePolishResponse resp = mapper.readValue(json, ResumePolishResponse.class);
            if (resp.getPolishedText() == null || resp.getPolishedText().isBlank()) {
                resp.setPolishedText(req.getText());
            }
            return resp;
        } catch (Exception e) {
            log.warn("polish parse error", e);
            ResumePolishResponse fallback = new ResumePolishResponse();
            fallback.setPolishedText(json);
            return fallback;
        }
    }

    /**
     * 岗位推荐
     */
    public JobRecommendResponse recommend(JobRecommendRequest req, String sort, Double minScore, String cityFilter) {
        String sys = "你是职业规划师，请依据简历内容推荐 5-10 个岗位并给出理由与评分（0-100）。";
        Map<String, Object> payload = new HashMap<>();
        payload.put("resumeText", req.getResumeText());
        payload.put("experienceYears", req.getExperienceYears());
        payload.put("preferredCities", req.getPreferredCities());
        payload.put("targetIndustry", req.getTargetIndustry());
        payload.put("targetRole", req.getTargetRole());

        String instruction = "严格输出 JSON：{ items: {title:string,company?:string,location?:string,score:number,reason:string}[] }，" +
                "评分越高越匹配；location 尽量匹配偏好城市。";
        String content;
        try { content = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(payload) + "\n" + instruction; }
        catch (Exception ex) { content = (req.getResumeText() == null ? "" : req.getResumeText()); }

        String json = chatClient
                .prompt()
                .system(sys)
                .user(content)
                .call()
                .content();
        json = sanitizeJson(json);
        log.debug("recommend response: {}", json);
        JobRecommendResponse result = new JobRecommendResponse();
        try {
            Map<String, Object> map = mapper.readValue(json, new TypeReference<Map<String, Object>>(){});
            List<JobRecommendItem> items = mapper.convertValue(map.get("items"), new TypeReference<List<JobRecommendItem>>(){});
            // 过滤与排序
            items = items == null ? List.of() : items;
            if (minScore != null) { items = items.stream().filter(i -> i.getScore() != null && i.getScore() >= minScore).toList(); }
            if (cityFilter != null && !cityFilter.isEmpty()) { items = items.stream().filter(i -> cityFilter.equalsIgnoreCase(i.getLocation())).toList(); }
            if ("score_desc".equalsIgnoreCase(sort)) { items = items.stream().sorted((a,b) -> Double.compare(b.getScore()==null?0:b.getScore(), a.getScore()==null?0:a.getScore())).toList(); }
            result.setItems(items);
        } catch (Exception e) {
            log.warn("recommend parse error", e);
            result.setItems(List.of());
        }
        return result;
    }

    /**
     * 岗位匹配度报告
     */
    public MatchReportResponse matchReport(MatchReportRequest req) {
        String sys = "你是 HR 招聘顾问，请对候选人的简历与岗位 JD 进行细致匹配分析并给出建议。所有评分范围为 0-100，分数越高表示越匹配。";
        String instruction = "请严格输出标准的 JSON 格式（无注释、无多余文本）：\n" +
                "{\n" +
                "  \"overall_score\": number,\n" +
                "  \"skill_match\": number,\n" +
                "  \"experience_relevance\": number,\n" +
                "  \"culture_fit\": number,\n" +
                "  \"analysis\": \"string\",\n" +
                "  \"suggestions\": [\"string\"],\n" +
                "  \"missing_keywords\": [\"string\"]\n" +
                "}";
        String content = "简历内容：\n" + req.getResumeText() + "\n\n岗位描述：\n" + req.getJobDescription() +
                (req.getCompanyCulture() != null ? ("\n\n公司文化/要求：\n" + req.getCompanyCulture()) : "") +
                "\n\n请严格按此格式返回报告：" + instruction;

        String json = chatClient
                .prompt()
                .system(sys)
                .user(content)
                .call()
                .content();
        json = sanitizeJson(json);
        log.debug("match-report response: {}", json);
        try {
            JsonNode root = mapper.readTree(json);
            Double skillMatch = pickNumber(root, "skill_match", "skillMatch");
            Double experienceRelevance = pickNumber(root, "experience_relevance", "experienceRelevance");
            Double cultureFit = pickNumber(root, "culture_fit", "cultureFit");
            Double overallScore = pickNumber(root, "overall_score", "overallScore", "score");

            // 兜底逻辑：如果 AI 漏掉了总分，根据分项进行加权计算 (技能50%, 经验40%, 文化10%)
            if (overallScore == null && skillMatch != null && experienceRelevance != null) {
                double cf = cultureFit != null ? cultureFit : 70.0;
                overallScore = Math.round((skillMatch * 0.5 + experienceRelevance * 0.4 + cf * 0.1) * 10.0) / 10.0;
            }

            String analysis = pickString(root, "analysis");
            List<String> suggestions = pickStringArray(root, "suggestions");
            List<String> missingKeywords = pickStringArray(root, "missing_keywords", "missingKeywords");

            MatchReportResponse resp = new MatchReportResponse();
            resp.setOverallScore(overallScore);
            resp.setSkillMatch(skillMatch);
            resp.setExperienceRelevance(experienceRelevance);
            resp.setCultureFit(cultureFit);
            resp.setAnalysis(analysis);
            resp.setSuggestions(suggestions);
            resp.setMissingKeywords(missingKeywords);
            return resp;
        } catch (Exception e) {
            log.warn("match-report parse error", e);
            MatchReportResponse fallback = new MatchReportResponse();
            try {
                JsonNode root = mapper.readTree(json);
                fallback.setOverallScore(pickNumber(root, "overall_score", "overallScore", "score"));
                fallback.setAnalysis(pickString(root, "analysis"));
                fallback.setSuggestions(pickStringArray(root, "suggestions"));
                fallback.setMissingKeywords(pickStringArray(root, "missing_keywords", "missingKeywords"));
            } catch (Exception ignored) {
                fallback.setAnalysis("AI 解析异常，原始返回：" + json);
                fallback.setSuggestions(List.of("系统解析失败，请尝试刷新重试"));
            }
            return fallback;
        }
    }

    private Double pickNumber(JsonNode root, String... keys) {
        for (String k : keys) {
            JsonNode n = root.get(k);
            if (n == null) continue;
            if (n.isNumber()) return n.doubleValue();
            if (n.isTextual()) {
                try { return Double.valueOf(n.asText()); } catch (Exception ignored) {}
            }
        }
        return null;
    }

    private String pickString(JsonNode root, String... keys) {
        for (String k : keys) {
            JsonNode n = root.get(k);
            if (n == null) continue;
            if (n.isTextual()) return n.asText();
            return n.toString();
        }
        return null;
    }

    private List<String> pickStringArray(JsonNode root, String... keys) {
        for (String k : keys) {
            JsonNode n = root.get(k);
            if (n == null) continue;
            if (n.isArray()) {
                List<String> list = new java.util.ArrayList<>();
                for (JsonNode e : n) { list.add(e.asText()); }
                return list;
            }
            if (n.isTextual()) {
                return List.of(n.asText());
            }
        }
        return List.of();
    }
}
