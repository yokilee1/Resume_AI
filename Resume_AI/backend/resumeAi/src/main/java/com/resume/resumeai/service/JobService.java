package com.resume.resumeai.service;

import com.resume.resumeai.domain.JobPosition;
import com.resume.resumeai.repository.JobRepository;
import com.resume.resumeai.util.PageUtil;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {
    private final JobRepository jobRepository;
    public JobService(JobRepository jobRepository) { this.jobRepository = jobRepository; }

    public List<JobPosition> search(String keywords, String city, int page, int pageSize) {
        int offset = PageUtil.offset(page, pageSize);
        return jobRepository.search(keywords, city, offset, pageSize);
    }

    public int count(String keywords, String city) {
        return jobRepository.count(keywords, city);
    }
}