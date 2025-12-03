package com.resume.resumeai.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResumeCreateRequest {
    private Long userId; // 将被忽略，以当前用户为准
    @NotBlank @Size(max = 128)
    private String title;
    @NotBlank
    private String contentJson;
    public Long getUserId() { return userId; } public void setUserId(Long userId) { this.userId = userId; }
    public String getTitle() { return title; } public void setTitle(String title) { this.title = title; }
    public String getContentJson() { return contentJson; } public void setContentJson(String contentJson) { this.contentJson = contentJson; }
}