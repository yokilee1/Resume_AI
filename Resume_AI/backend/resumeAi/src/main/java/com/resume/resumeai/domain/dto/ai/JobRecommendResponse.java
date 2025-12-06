package com.resume.resumeai.domain.dto.ai;

import java.util.List;

/**
 * 岗位推荐响应
 */
public class JobRecommendResponse {
    private List<JobRecommendItem> items;

    public List<JobRecommendItem> getItems() { return items; }
    public void setItems(List<JobRecommendItem> items) { this.items = items; }
}

