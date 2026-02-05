package com.resume.resumeai.service;

import com.resume.resumeai.crawler.CrawlerService;
import com.resume.resumeai.domain.CrawlerTask;
import com.resume.resumeai.domain.JobPosition;
import com.resume.resumeai.domain.User;
import com.resume.resumeai.repository.CrawlerTaskRepository;
import com.resume.resumeai.repository.JobRepository;
import com.resume.resumeai.repository.ResumeRepository;
import com.resume.resumeai.repository.TemplateRepository;
import com.resume.resumeai.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AdminService {
    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;
    private final CrawlerTaskRepository crawlerTaskRepository;
    private final TemplateRepository templateRepository;
    private final JobRepository jobRepository;
    private final CrawlerService crawlerService;

    public AdminService(UserRepository userRepository, 
                        ResumeRepository resumeRepository,
                        CrawlerTaskRepository crawlerTaskRepository,
                        TemplateRepository templateRepository,
                        JobRepository jobRepository,
                        CrawlerService crawlerService) {
        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
        this.crawlerTaskRepository = crawlerTaskRepository;
        this.templateRepository = templateRepository;
        this.jobRepository = jobRepository;
        this.crawlerService = crawlerService;
    }

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("userCount", userRepository.count());
        stats.put("resumeCount", resumeRepository.count(null));
        stats.put("jobCount", jobRepository.count(null, null));
        
        // Real chart data from JobRepository
        stats.put("crawlTrend", jobRepository.getCrawlTrend());
        stats.put("sourceDistribution", jobRepository.getSourceDistribution());

        // Mock activity for now, can be implemented with real logs later
        stats.put("recentActivity", List.of(
            Map.of("id", 1, "user", "System", "action", "System Startup", "time", "Just now")
        ));
        return stats;
    }

    public List<User> listUsers(int page, int pageSize) {
        return userRepository.findAll(page, pageSize);
    }

    public Map<String, Object> listJobs(int page, int pageSize) {
        int offset = (page - 1) * pageSize;
        List<JobPosition> items = jobRepository.findAll(offset, pageSize);
        int total = jobRepository.count(null, null);
        return Map.of("items", items, "total", total);
    }

    @Transactional
    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }

    @Transactional
    public void updateUserRole(Long userId, String role) {
        userRepository.updateRole(userId, role);
    }

    @Transactional
    public void updateUserStatus(Long userId, String status) {
        userRepository.updateStatus(userId, status);
    }

    public List<CrawlerTask> listCrawlerTasks() {
        return crawlerTaskRepository.list();
    }

    @Transactional
    public CrawlerTask createCrawlerTask(CrawlerTask task) {
        if (task.getId() == null) {
            task.setId(UUID.randomUUID().toString());
        }
        task.setNextRun("Pending");
        task.setStatus("Active");
        crawlerTaskRepository.create(task);
        
        // Trigger crawler immediately in a separate thread (simplified)
        new Thread(() -> {
            crawlerService.runCrawler(task.getId(),task.getSource(), task.getQuery(), "全国"); // City hardcoded or add to task
        }).start();
        
        return task;
    }

    @Transactional
    public void deleteCrawlerTask(String id) {
        crawlerTaskRepository.delete(id);
    }

    @Transactional
    public void updateCrawlerTaskStatus(String id, String status) {
        crawlerTaskRepository.updateStatus(id, status);
    }

    @Transactional
    public void updateTemplateStatus(Long id, String status) {
        templateRepository.updateStatus(id, status);
    }
}
