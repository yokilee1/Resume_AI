package com.resume.resumeai.domain.dto.ai;

import jakarta.validation.constraints.NotBlank;

/**
 * 接收简历润色请求
 */
public class ResumePolishRequest {
    @NotBlank
    private String text;
    private String industry;
    private String role;
    private String language;

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}

