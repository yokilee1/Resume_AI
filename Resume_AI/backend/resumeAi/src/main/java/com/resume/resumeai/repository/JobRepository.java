package com.resume.resumeai.repository;

import com.resume.resumeai.domain.JobPosition;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class JobRepository {
    private final NamedParameterJdbcTemplate jdbc;
    public JobRepository(NamedParameterJdbcTemplate jdbc) { this.jdbc = jdbc; }

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
}