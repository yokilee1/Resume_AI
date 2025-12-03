package com.resume.resumeai.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class JobSearchAndMatchPerformanceTest {
    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @Test
    @DisplayName("职位搜索基本性能: 响应时间<500ms")
    void jobSearchPerformance() throws Exception {
        long t0 = System.currentTimeMillis();
        String resp = mockMvc.perform(get("/api/jobs/search")
                        .param("keywords", "Java")
                        .param("city", "北京"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        long elapsed = System.currentTimeMillis() - t0;
        assertThat(elapsed).isLessThan(500L);
        JsonNode node = objectMapper.readTree(resp);
        assertThat(node.get("data").get("items").size()).isGreaterThan(0);
    }

    @Test
    @DisplayName("简历匹配基本性能: 响应时间<700ms")
    void matchPerformance() throws Exception {
        long t0 = System.currentTimeMillis();
        String resp = mockMvc.perform(post("/api/match/recommendations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"resumeText\":\"Java Spring MySQL Redis\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        long elapsed = System.currentTimeMillis() - t0;
        assertThat(elapsed).isLessThan(700L);
        JsonNode node = objectMapper.readTree(resp);
        assertThat(node.get("data").get("items").size()).isGreaterThan(0);
    }
}