package com.resume.resumeai.domain.dto.ai;

import java.util.List;
import jakarta.validation.constraints.NotBlank;

/**
 * 接收岗位推荐请求
 */
public class JobRecommendRequest {
    @NotBlank
    private String resumeText;
    private Integer experienceYears;
    private List<String> preferredCities;
    private String targetIndustry;
    private String targetRole;

    public String getResumeText() { return resumeText; }
    public void setResumeText(String resumeText) { this.resumeText = resumeText; }
    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }
    public List<String> getPreferredCities() { return preferredCities; }
    public void setPreferredCities(List<String> preferredCities) { this.preferredCities = preferredCities; }
    public String getTargetIndustry() { return targetIndustry; }
    public void setTargetIndustry(String targetIndustry) { this.targetIndustry = targetIndustry; }
    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
}

