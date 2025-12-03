package com.resume.resumeai.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResumeUpdateRequest {
    @NotBlank @Size(max = 128)
    private String title;
    @NotBlank
    private String contentJson;
    @NotBlank
    private String status;
    public String getTitle() { return title; } public void setTitle(String title) { this.title = title; }
    public String getContentJson() { return contentJson; } public void setContentJson(String contentJson) { this.contentJson = contentJson; }
    public String getStatus() { return status; } public void setStatus(String status) { this.status = status; }
}