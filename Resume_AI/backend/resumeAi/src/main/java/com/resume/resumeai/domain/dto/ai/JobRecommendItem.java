package com.resume.resumeai.domain.dto.ai;

/**
 * 岗位推荐条目
 */
public class JobRecommendItem {
    private String title;
    private String company;
    private String location;
    private Double score;
    private String reason;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}

