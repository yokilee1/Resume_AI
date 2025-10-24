package com.resume.resumeai.domain;

import java.time.Instant;

public class Resume {
    private Long id;
    private Long userId;
    private String title;
    private String contentJson;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; } public void setUserId(Long userId) { this.userId = userId; }
    public String getTitle() { return title; } public void setTitle(String title) { this.title = title; }
    public String getContentJson() { return contentJson; } public void setContentJson(String contentJson) { this.contentJson = contentJson; }
    public String getStatus() { return status; } public void setStatus(String status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; } public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; } public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}