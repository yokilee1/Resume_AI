package com.resume.resumeai.crawler;

import com.resume.resumeai.domain.JobPosition;
import java.util.List;

public interface BaseCrawler {
    List<JobPosition> crawl(String keyword, String city);
}
