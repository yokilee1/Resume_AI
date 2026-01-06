package com.resume.resumeai.crawler;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.resume.resumeai.domain.CrawlerTask;
import com.resume.resumeai.domain.JobPosition;
import com.resume.resumeai.repository.CrawlerTaskRepository;
import com.resume.resumeai.repository.JobRepository;

@Service
public class CrawlerService {

    private final JobRepository jobRepository;
    private final CrawlerTaskRepository taskRepository;
    private final Map<String, BaseCrawler> crawlers;

    public CrawlerService(JobRepository jobRepository, CrawlerTaskRepository taskRepository, Map<String, BaseCrawler> crawlers) {
        this.jobRepository = jobRepository;
        this.taskRepository = taskRepository;
        this.crawlers = crawlers;
    }

    public void runCrawler(String source, String keyword, String city) {
        runCrawler(null, source, keyword, city);
    }

    public void runCrawler(String taskId, String source, String keyword, String city) {
        BaseCrawler crawler;
        if ("shixiseng.com".equalsIgnoreCase(source) || "shixiseng".equalsIgnoreCase(source)) {
            crawler = crawlers.get("shixisengCrawler");
        } else if ("lagou.com".equalsIgnoreCase(source) || "lagou".equalsIgnoreCase(source)) {
            crawler = crawlers.get("lagouCrawler");
        } else {
            // Default or throw error
            System.out.println("Unknown source: " + source);
            return;
        }

        if (crawler != null) {
            try {
                List<JobPosition> jobs = crawler.crawl(keyword, city);
                if (!jobs.isEmpty()) {
                    jobRepository.saveAll(jobs);
                    System.out.println("Saved " + jobs.size() + " jobs from " + source);
                }
                
                // Update task status if taskId is provided
                if (taskId != null) {
                    updateTaskStatus(taskId, "Completed", jobs.size());
                }
            } catch (Exception e) {
                e.printStackTrace();
                if (taskId != null) {
                    updateTaskStatus(taskId, "Failed", 0);
                }
            }
        }
    }

    private void updateTaskStatus(String taskId, String status, int count) {
        Optional<CrawlerTask> taskOpt = taskRepository.findById(taskId);
        if (taskOpt.isPresent()) {
            CrawlerTask task = taskOpt.get();
            String lastRun = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            // Simple next run logic: assume daily if not specified, logic can be enhanced based on frequency
            String nextRun = LocalDateTime.now().plusDays(1).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            
            taskRepository.updateExecutionState(taskId, status, lastRun, nextRun);
            System.out.println("Updated task " + taskId + " to " + status);
        }
    }
}
