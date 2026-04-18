package com.resume.resumeai.crawler;

import com.resume.resumeai.domain.CrawlerTask;
import com.resume.resumeai.domain.JobPosition;
import com.resume.resumeai.repository.CrawlerTaskRepository;
import com.resume.resumeai.repository.JobRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class CrawlerServiceTest {

    private CrawlerService crawlerService;
    private JobRepository jobRepository;
    private CrawlerTaskRepository taskRepository;
    private BaseCrawler shixisengCrawler;
    private BaseCrawler lagouCrawler;

    @BeforeEach
    void setUp() {
        jobRepository = mock(JobRepository.class);
        taskRepository = mock(CrawlerTaskRepository.class);
        shixisengCrawler = mock(BaseCrawler.class);
        lagouCrawler = mock(BaseCrawler.class);

        Map<String, BaseCrawler> crawlers = new HashMap<>();
        crawlers.put("shixisengCrawler", shixisengCrawler);
        crawlers.put("lagouCrawler", lagouCrawler);

        crawlerService = new CrawlerService(jobRepository, taskRepository, crawlers);
    }

    @Test
    @DisplayName("runCrawler: 成功调用 shixiseng 爬虫并保存")
    void runCrawler_shixiseng_success() {
        JobPosition job = new JobPosition();
        when(shixisengCrawler.crawl("Java", "北京")).thenReturn(List.of(job));

        crawlerService.runCrawler("shixiseng", "Java", "北京");

        verify(shixisengCrawler).crawl("Java", "北京");
        verify(jobRepository).saveAll(anyList());
    }

    @Test
    @DisplayName("runCrawler: 带 taskId 时成功更新任务状态")
    void runCrawler_with_taskId_success() {
        String taskId = "task-123";
        when(shixisengCrawler.crawl(anyString(), anyString())).thenReturn(List.of(new JobPosition()));
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(new CrawlerTask()));

        crawlerService.runCrawler(taskId, "shixiseng", "Java", "北京");

        verify(taskRepository).updateExecutionState(eq(taskId), eq("Completed"), anyString(), anyString());
    }

    @Test
    @DisplayName("runCrawler: 爬虫异常时更新状态为 Failed")
    void runCrawler_failure() {
        String taskId = "task-error";
        when(lagouCrawler.crawl(anyString(), anyString())).thenThrow(new RuntimeException("Network error"));
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(new CrawlerTask()));

        crawlerService.runCrawler(taskId, "lagou", "Java", "北京");

        verify(taskRepository).updateExecutionState(eq(taskId), eq("Failed"), anyString(), anyString());
    }

    @Test
    @DisplayName("runCrawler: 未知来源应直接返回")
    void runCrawler_unknown_source() {
        crawlerService.runCrawler("unknown", "Java", "北京");
        verifyNoInteractions(jobRepository);
    }
}
