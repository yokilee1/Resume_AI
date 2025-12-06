package com.resume.resumeai.domain.dto.ai;

import jakarta.validation.constraints.NotBlank;

/**
 * 岗位匹配度评估请求
 */
public class MatchReportRequest {
    @NotBlank
    private String resumeText;
    @NotBlank
    private String jobDescription;
    private String companyCulture;

    public String getResumeText() { return resumeText; }
    public void setResumeText(String resumeText) { this.resumeText = resumeText; }
    public String getJobDescription() { return jobDescription; }
    public void setJobDescription(String jobDescription) { this.jobDescription = jobDescription; }
    public String getCompanyCulture() { return companyCulture; }
    public void setCompanyCulture(String companyCulture) { this.companyCulture = companyCulture; }
}

