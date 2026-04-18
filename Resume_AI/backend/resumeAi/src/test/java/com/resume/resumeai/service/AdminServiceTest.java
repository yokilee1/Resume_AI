package com.resume.resumeai.service;

import com.resume.resumeai.crawler.CrawlerService;
import com.resume.resumeai.domain.CrawlerTask;
import com.resume.resumeai.domain.JobPosition;
import com.resume.resumeai.domain.User;
import com.resume.resumeai.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class AdminServiceTest {

    private AdminService adminService;
    private UserRepository userRepository;
    private ResumeRepository resumeRepository;
    private CrawlerTaskRepository crawlerTaskRepository;
    private TemplateRepository templateRepository;
    private JobRepository jobRepository;
    private CrawlerService crawlerService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        resumeRepository = mock(ResumeRepository.class);
        crawlerTaskRepository = mock(CrawlerTaskRepository.class);
        templateRepository = mock(TemplateRepository.class);
        jobRepository = mock(JobRepository.class);
        crawlerService = mock(CrawlerService.class);

        adminService = new AdminService(userRepository, resumeRepository, crawlerTaskRepository,
                templateRepository, jobRepository, crawlerService);
    }

    @Test
    @DisplayName("getStats: 聚合各模块统计数据")
    void getStats_logic() {
        when(userRepository.count()).thenReturn(10);
        when(resumeRepository.count(null)).thenReturn(20);
        when(jobRepository.count(null, null)).thenReturn(30);
        when(jobRepository.getCrawlTrend()).thenReturn(List.of(Map.of("date", "Mon", "count", 5)));

        Map<String, Object> stats = adminService.getStats();

        assertThat(stats.get("userCount")).isEqualTo(10);
        assertThat(stats.get("resumeCount")).isEqualTo(20);
        assertThat(stats.get("jobCount")).isEqualTo(30);
        assertThat(stats.get("crawlTrend")).isInstanceOf(List.class);
    }

    @Test
    @DisplayName("listJobs: 验证分页与计数逻辑")
    void listJobs_pagination() {
        JobPosition j = new JobPosition();
        when(jobRepository.findAll(0, 10)).thenReturn(List.of(j));
        when(jobRepository.count(null, null)).thenReturn(1);

        Map<String, Object> result = adminService.listJobs(1, 10);
        assertThat(result.get("total")).isEqualTo(1);
        assertThat((List) result.get("items")).hasSize(1);
    }

    @Test
    @DisplayName("createCrawlerTask: 生成 ID 并触发异步爬取")
    void createCrawlerTask_triggers_crawler() throws InterruptedException {
        CrawlerTask task = new CrawlerTask();
        task.setSource("lagou");
        task.setQuery("Java");

        adminService.createCrawlerTask(task);

        assertThat(task.getId()).isNotNull();
        assertThat(task.getStatus()).isEqualTo("Active");
        verify(crawlerTaskRepository).create(task);
        
        // Wait briefly for the thread to trigger mock
        Thread.sleep(100);
        verify(crawlerService).runCrawler(eq(task.getId()), eq("lagou"), eq("Java"), anyString());
    }

    @Test
    @DisplayName("deleteUser: 调用 repository 删除")
    void deleteUser_calls_repo() {
        adminService.deleteUser(1L);
        verify(userRepository).deleteById(1L);
    }
}
