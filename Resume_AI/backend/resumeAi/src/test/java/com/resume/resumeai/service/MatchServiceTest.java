package com.resume.resumeai.service;

import com.resume.resumeai.domain.JobPosition;
import com.resume.resumeai.repository.JobRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class MatchServiceTest {

    private MatchService matchService;
    private JobRepository jobRepository;

    @BeforeEach
    void setUp() {
        jobRepository = mock(JobRepository.class);
        matchService = new MatchService(jobRepository);
    }

    @Test
    @DisplayName("recommend: 根据简历内容推荐并打分")
    void recommend_with_content() {
        JobPosition j1 = new JobPosition();
        j1.setJobTitle("Java Developer");
        j1.setCompanyName("Tech Corp");
        j1.setJobDescription("Java Spring MySQL");
        
        when(jobRepository.search(anyString(), any(), anyInt(), anyInt()))
                .thenReturn(List.of(j1));

        Map<String, Object> result = matchService.recommend(Map.of("resumeText", "Java Developer"));
        
        List<Map<String, Object>> items = (List<Map<String, Object>>) result.get("items");
        assertThat(items).hasSize(1);
        assertThat((Double) items.get(0).get("score")).isGreaterThan(0.0);
        assertThat(result.get("explain")).asString().contains("简历文本");
    }

    @Test
    @DisplayName("recommend: 当没有简历内容时直接返回候选人")
    void recommend_no_content() {
        JobPosition j1 = new JobPosition();
        j1.setJobTitle("Any Job");
        when(jobRepository.search(any(), any(), anyInt(), anyInt()))
                .thenReturn(List.of(j1));

        Map<String, Object> result = matchService.recommend(Collections.emptyMap());
        
        List<JobPosition> items = (List<JobPosition>) result.get("items");
        assertThat(items).hasSize(1);
        assertThat(result.get("explain")).asString().contains("未提供");
    }
}
