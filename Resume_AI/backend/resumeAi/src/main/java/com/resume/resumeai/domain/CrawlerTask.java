package com.resume.resumeai.domain;

/**
 * 爬虫调度任务实体
 */
public class CrawlerTask {
    private String id;
    private String query;
    private String source;
    private String frequency; // 'Every 6 Hours', 'Daily', etc.
    private String lastRun;
    private String nextRun;
    private String status; // 'Active' or 'Paused'

    public String getId() { return id; } public void setId(String id) { this.id = id; }
    public String getQuery() { return query; } public void setQuery(String query) { this.query = query; }
    public String getSource() { return source; } public void setSource(String source) { this.source = source; }
    public String getFrequency() { return frequency; } public void setFrequency(String frequency) { this.frequency = frequency; }
    public String getLastRun() { return lastRun; } public void setLastRun(String lastRun) { this.lastRun = lastRun; }
    public String getNextRun() { return nextRun; } public void setNextRun(String nextRun) { this.nextRun = nextRun; }
    public String getStatus() { return status; } public void setStatus(String status) { this.status = status; }
}
