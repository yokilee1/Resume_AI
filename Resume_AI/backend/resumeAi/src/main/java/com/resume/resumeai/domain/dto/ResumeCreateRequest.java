package com.resume.resumeai.domain.dto;

public class ResumeCreateRequest {
    private Long userId;
    private String title;
    private String contentJson;
    public Long getUserId() { return userId; } public void setUserId(Long userId) { this.userId = userId; }
    public String getTitle() { return title; } public void setTitle(String title) { this.title = title; }
    public String getContentJson() { return contentJson; } public void setContentJson(String contentJson) { this.contentJson = contentJson; }
}