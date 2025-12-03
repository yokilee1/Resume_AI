package com.resume.resumeai.service;

import com.resume.resumeai.domain.JobPosition;
import com.resume.resumeai.repository.JobRepository;
import com.resume.resumeai.util.TextMatcher;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchService {
    private final JobRepository jobRepository;
    public MatchService(JobRepository jobRepository) { this.jobRepository = jobRepository; }

    public Map<String, Object> recommend(Map<String, Object> payload) {
        String keywords = asString(payload.get("keywords"));
        String resumeText = asString(payload.get("resumeText"));
        if (resumeText == null) resumeText = asString(payload.get("resumeContent"));
        if (resumeText == null) resumeText = asString(payload.get("content"));

        // 查询一页岗位，默认取前50条用于评分
        List<JobPosition> candidates = jobRepository.search(
                keywords != null ? keywords : resumeText,
                null,
                0,
                50
        );

        String explain;
        if (keywords != null && !keywords.isBlank()) {
            explain = "基于关键词检索与文本重合度打分";
        } else if (resumeText != null && !resumeText.isBlank()) {
            explain = "基于简历文本与岗位描述重合度打分";
        } else {
            explain = "未提供关键词或简历文本，返回最新岗位";
        }

        // 当未提供文本时直接返回最新岗位
        if ((keywords == null || keywords.isBlank()) && (resumeText == null || resumeText.isBlank())) {
            return Map.of(
                    "items", candidates,
                    "explain", explain
            );
        }

        String basis = keywords != null && !keywords.isBlank() ? keywords : resumeText;
        final String basisText = basis;
        List<Map<String, Object>> scored = candidates.stream()
                .map(j -> {
                    String jobText = String.join(" ",
                            nullToEmpty(j.getJobTitle()),
                            nullToEmpty(j.getCompanyName()),
                            nullToEmpty(j.getJobDescription())
                    );
                    double score = TextMatcher.score(basisText, jobText);
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("job", j);
                    m.put("score", score);
                    return m;
                })
                .sorted((a, b) -> Double.compare((Double) b.get("score"), (Double) a.get("score")))
                .limit(10)
                .collect(Collectors.toList());

        return Map.of(
                "items", scored,
                "explain", explain
        );
    }

    private static String asString(Object v) { return v == null ? null : String.valueOf(v); }
    private static String nullToEmpty(String s) { return s == null ? "" : s; }
}