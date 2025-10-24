package com.resume.resumeai.domain.dto;

public class ResumeUpdateRequest {
    private String title;
    private String contentJson;
    private String status;
    public String getTitle() { return title; } public void setTitle(String title) { this.title = title; }
    public String getContentJson() { return contentJson; } public void setContentJson(String contentJson) { this.contentJson = contentJson; }
    public String getStatus() { return status; } public void setStatus(String status) { this.status = status; }
}