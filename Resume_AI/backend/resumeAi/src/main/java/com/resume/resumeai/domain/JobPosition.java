package com.resume.resumeai.domain;

import java.time.LocalDateTime;

public class JobPosition {
    private Long id;
    private String jobTitle;
    private String companyName;
    private String jobDescription;
    private String location;
    private String salary;
    private String sourceUrl;
    private LocalDateTime crawlTime;
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getJobTitle() { return jobTitle; } public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public String getCompanyName() { return companyName; } public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getJobDescription() { return jobDescription; } public void setJobDescription(String jobDescription) { this.jobDescription = jobDescription; }
    public String getLocation() { return location; } public void setLocation(String location) { this.location = location; }
    public String getSalary() { return salary; } public void setSalary(String salary) { this.salary = salary; }
    public String getSourceUrl() { return sourceUrl; } public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }
    public LocalDateTime getCrawlTime() { return crawlTime; } public void setCrawlTime(LocalDateTime crawlTime) { this.crawlTime = crawlTime; }
}