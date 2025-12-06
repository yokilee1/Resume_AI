package com.resume.resumeai.domain.dto.ai;

import java.util.List;

/**
 * 岗位匹配度评分与建议
 */
public class MatchReportResponse {
    private Double overallScore;
    private Double skillMatch;
    private Double experienceRelevance;
    private Double cultureFit;
    private String analysis;
    private List<String> suggestions;
    private List<String> missingKeywords;

    public Double getOverallScore() { return overallScore; }
    public void setOverallScore(Double overallScore) { this.overallScore = overallScore; }
    public Double getSkillMatch() { return skillMatch; }
    public void setSkillMatch(Double skillMatch) { this.skillMatch = skillMatch; }
    public Double getExperienceRelevance() { return experienceRelevance; }
    public void setExperienceRelevance(Double experienceRelevance) { this.experienceRelevance = experienceRelevance; }
    public Double getCultureFit() { return cultureFit; }
    public void setCultureFit(Double cultureFit) { this.cultureFit = cultureFit; }
    public String getAnalysis() { return analysis; }
    public void setAnalysis(String analysis) { this.analysis = analysis; }
    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }
    public List<String> getMissingKeywords() { return missingKeywords; }
    public void setMissingKeywords(List<String> missingKeywords) { this.missingKeywords = missingKeywords; }
}

