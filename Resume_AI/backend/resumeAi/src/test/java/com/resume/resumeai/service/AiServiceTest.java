package com.resume.resumeai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resume.resumeai.domain.dto.ai.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.ChatClient.Builder;
import org.springframework.ai.chat.client.ChatClient.ChatClientRequestSpec;
import org.springframework.ai.chat.client.ChatClient.CallResponseSpec;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class AiServiceTest {

    private AiService aiService;
    private ChatClient chatClient;
    private Builder chatClientBuilder;
    private ObjectMapper mapper;

    @BeforeEach
    void setUp() {
        chatClient = mock(ChatClient.class);
        chatClientBuilder = mock(Builder.class);
        when(chatClientBuilder.build()).thenReturn(chatClient);
        
        mapper = new ObjectMapper();
        mapper.setPropertyNamingStrategy(com.fasterxml.jackson.databind.PropertyNamingStrategies.SNAKE_CASE);
        aiService = new AiService(chatClientBuilder, mapper);
    }

    @Test
    @DisplayName("polish: 成功解析带 Markdown 围栏的 JSON")
    void polish_success_with_markdown() {
        String mockResponse = "```json\n{\"polished_text\": \"Optimized content\"}\n```";
        setupMockChatCall(mockResponse);

        ResumePolishRequest req = new ResumePolishRequest();
        req.setText("Original content");
        
        ResumePolishResponse resp = aiService.polish(req);
        
        assertThat(resp.getPolishedText()).isEqualTo("Optimized content");
    }

    @Test
    @DisplayName("polish: 解析失败时返回原文作为回退")
    void polish_fallback_on_error() {
        setupMockChatCall("invalid json");

        ResumePolishRequest req = new ResumePolishRequest();
        req.setText("Original content");
        
        ResumePolishResponse resp = aiService.polish(req);
        
        assertThat(resp.getPolishedText()).isEqualTo("invalid json");
    }

    @Test
    @DisplayName("recommend: 成功解析并过滤最低分")
    void recommend_success_with_filter() {
        String mockResponse = "{\"items\": [" +
                "{\"title\":\"Java Guy\", \"score\": 90, \"reason\": \"Good\"}," +
                "{\"title\":\"Python Guy\", \"score\": 50, \"reason\": \"Bad\"}" +
                "]}";
        setupMockChatCall(mockResponse);

        JobRecommendRequest req = new JobRecommendRequest();
        JobRecommendResponse resp = aiService.recommend(req, null, 80.0, null);
        
        assertThat(resp.getItems()).hasSize(1);
        assertThat(resp.getItems().get(0).getTitle()).isEqualTo("Java Guy");
    }

    @Test
    @DisplayName("matchReport: 处理多种字段名映射 (overall_score vs score)")
    void matchReport_flexible_keys() {
        String mockResponse = "{\"score\": 95, \"analysis\": \"Great match\"}";
        setupMockChatCall(mockResponse);

        MatchReportRequest req = new MatchReportRequest();
        MatchReportResponse resp = aiService.matchReport(req);
        
        assertThat(resp.getOverallScore()).isEqualTo(95.0);
        assertThat(resp.getAnalysis()).isEqualTo("Great match");
    }

    private void setupMockChatCall(String responseText) {
        ChatClientRequestSpec requestSpec = mock(ChatClientRequestSpec.class);
        CallResponseSpec responseSpec = mock(CallResponseSpec.class);
        
        when(chatClient.prompt()).thenReturn(requestSpec);
        when(requestSpec.system(anyString())).thenReturn(requestSpec);
        when(requestSpec.user(anyString())).thenReturn(requestSpec);
        when(requestSpec.call()).thenReturn(responseSpec);
        when(responseSpec.content()).thenReturn(responseText);
    }
}
