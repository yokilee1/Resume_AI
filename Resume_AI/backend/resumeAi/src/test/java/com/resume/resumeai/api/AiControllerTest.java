package com.resume.resumeai.api;

import com.resume.resumeai.domain.dto.ai.*;
import com.resume.resumeai.service.AiService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AiController.class)
@AutoConfigureMockMvc(addFilters = false)
class AiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AiService aiService;

    @Test
    @DisplayName("简历润色成功返回结果")
    void polish_success() throws Exception {
        ResumePolishResponse resp = new ResumePolishResponse();
        resp.setPolishedText("优化后的文本");
        resp.setSuggestions(List.of("建议 A"));
        when(aiService.polish(org.mockito.ArgumentMatchers.any(ResumePolishRequest.class))).thenReturn(resp);

        String body = "{\"text\":\"我有五年Java经验\",\"industry\":\"互联网\",\"role\":\"后端工程师\"}";
        mockMvc.perform(post("/api/ai/polish").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is("OK")))
                .andExpect(jsonPath("$.data.polished_text", is("优化后的文本")))
                .andExpect(jsonPath("$.data.suggestions[0]", is("建议 A")));
    }

    @Test
    @DisplayName("岗位推荐返回列表并可排序过滤")
    void recommend_success() throws Exception {
        JobRecommendItem item = new JobRecommendItem();
        item.setTitle("Java工程师"); item.setScore(90.0);
        JobRecommendResponse resp = new JobRecommendResponse();
        resp.setItems(List.of(item));
        when(aiService.recommend(org.mockito.ArgumentMatchers.any(JobRecommendRequest.class), anyString(), any(), anyString())).thenReturn(resp);

        String body = "{\"resume_text\":\"...\"}";
        mockMvc.perform(post("/api/ai/recommend-jobs?sort=score_desc&minScore=80&city=上海")
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is("OK")))
                .andExpect(jsonPath("$.data.items[0].title", containsString("Java")));
    }

    @Test
    @DisplayName("匹配度评估返回评分与建议")
    void match_success() throws Exception {
        MatchReportResponse resp = new MatchReportResponse();
        resp.setOverallScore(85.0);
        resp.setSuggestions(List.of("优化项目成果描述"));
        when(aiService.matchReport(org.mockito.ArgumentMatchers.any(MatchReportRequest.class))).thenReturn(resp);

        String body = "{\"resume_text\":\"...\",\"job_description\":\"...\"}";
        mockMvc.perform(post("/api/ai/match-report").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is("OK")))
                .andExpect(jsonPath("$.data.overall_score", is(85.0)))
                .andExpect(jsonPath("$.data.suggestions[0]", containsString("优化")));
    }
}
