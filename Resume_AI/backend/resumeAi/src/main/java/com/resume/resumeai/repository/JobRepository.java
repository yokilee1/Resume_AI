package com.resume.resumeai.repository;

import com.resume.resumeai.domain.JobPosition;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class JobRepository {
    private final NamedParameterJdbcTemplate jdbc;
    public JobRepository(NamedParameterJdbcTemplate jdbc) { this.jdbc = jdbc; }

    public List<JobPosition> findAll(int offset, int limit) {
        String sql = """
            SELECT id, job_title, company_name, job_description, location, salary, source_url, crawl_time
            FROM job_positions
            ORDER BY crawl_time DESC
            LIMIT :limit OFFSET :offset
        """;
        return jdbc.query(sql, Map.of("limit", limit, "offset", offset), (rs, i) -> {
            JobPosition j = new JobPosition();
            j.setId(rs.getLong("id"));
            j.setJobTitle(rs.getString("job_title"));
            j.setCompanyName(rs.getString("company_name"));
            j.setJobDescription(rs.getString("job_description"));
            j.setLocation(rs.getString("location"));
            j.setSalary(rs.getString("salary"));
            j.setSourceUrl(rs.getString("source_url"));
            j.setCrawlTime(rs.getTimestamp("crawl_time").toLocalDateTime());
            return j;
        });
    }

    public void deleteById(Long id) {
        jdbc.update("DELETE FROM job_positions WHERE id=:id", Map.of("id", id));
    }

    public List<JobPosition> search(String keywords, String city, int offset, int limit) {
        String sql = """
            SELECT id, job_title, company_name, job_description, location, salary, source_url, crawl_time
            FROM job_positions
            WHERE (:kw IS NULL OR CONCAT_WS(' ', job_title, company_name, job_description) LIKE :kwLike)
            AND (:city IS NULL OR location LIKE :cityLike)
            ORDER BY crawl_time DESC
            LIMIT :limit OFFSET :offset
        """;
        Map<String, Object> p = new HashMap<>();
        p.put("kw", keywords);
        p.put("kwLike", keywords == null ? null : "%" + keywords + "%");
        p.put("city", city);
        p.put("cityLike", city == null ? null : "%" + city + "%");
        p.put("limit", limit);
        p.put("offset", offset);
        return jdbc.query(sql, p, (rs, i) -> {
            JobPosition j = new JobPosition();
            j.setId(rs.getLong("id"));
            j.setJobTitle(rs.getString("job_title"));
            j.setCompanyName(rs.getString("company_name"));
            j.setJobDescription(rs.getString("job_description"));
            j.setLocation(rs.getString("location"));
            j.setSalary(rs.getString("salary"));
            j.setSourceUrl(rs.getString("source_url"));
            j.setCrawlTime(rs.getTimestamp("crawl_time").toLocalDateTime());
            return j;
        });
    }

    public int count(String keywords, String city) {
        String sql = """
            SELECT COUNT(1) FROM job_positions
            WHERE (:kw IS NULL OR CONCAT_WS(' ', job_title, company_name, job_description) LIKE :kwLike)
            AND (:city IS NULL OR location LIKE :cityLike)
        """;
        Map<String, Object> p = new HashMap<>();
        p.put("kw", keywords);
        p.put("kwLike", keywords == null ? null : "%" + keywords + "%");
        p.put("city", city);
        p.put("cityLike", city == null ? null : "%" + city + "%");
        Integer r = jdbc.queryForObject(sql, p, Integer.class);
        return r == null ? 0 : r;
    }

    public void saveAll(List<JobPosition> jobs) {
        String sql = """
            INSERT INTO job_positions (job_title, company_name, job_description, location, salary, source_url, crawl_time)
            VALUES (:jobTitle, :companyName, :jobDescription, :location, :salary, :sourceUrl, :crawlTime)
        """;
        List<Map<String, Object>> batchValues = new ArrayList<>();
        for (JobPosition job : jobs) {
            Map<String, Object> map = new HashMap<>();
            map.put("jobTitle", job.getJobTitle());
            map.put("companyName", job.getCompanyName());
            map.put("jobDescription", job.getJobDescription());
            map.put("location", job.getLocation());
            map.put("salary", job.getSalary());
            map.put("sourceUrl", job.getSourceUrl());
            map.put("crawlTime", job.getCrawlTime());
            batchValues.add(map);
        }
        jdbc.batchUpdate(sql, batchValues.toArray(new Map[0]));
    }
    
    public List<Map<String, Object>> getCrawlTrend() {
        String sql = """
            SELECT DATE_FORMAT(crawl_time, '%a') as date, COUNT(*) as count 
            FROM job_positions 
            WHERE crawl_time >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
            GROUP BY DATE_FORMAT(crawl_time, '%a'), DATE(crawl_time)
            ORDER BY DATE(crawl_time)
        """;
        return jdbc.queryForList(sql, Map.of());
    }

    public List<Map<String, Object>> getSourceDistribution() {
        // Simplified grouping by source_url column. 
        // If source_url contains full URL, we might want to extract domain here or in service.
        // Assuming it stores cleaner source names based on current usage.
        String sql = """
            SELECT source_url as source, COUNT(*) as count 
            FROM job_positions 
            GROUP BY source_url
            ORDER BY count DESC
            LIMIT 5
        """;
        return jdbc.queryForList(sql, Map.of());
    }
}
