package com.resume.resumeai.repository;

import com.resume.resumeai.domain.CrawlerTask;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class CrawlerTaskRepository {
    private final NamedParameterJdbcTemplate jdbc;
    public CrawlerTaskRepository(NamedParameterJdbcTemplate jdbc) { this.jdbc = jdbc; }

    public List<CrawlerTask> list() {
        String sql = "SELECT id, query, source, frequency, last_run, next_run, status FROM crawler_tasks ORDER BY created_at DESC";
        return jdbc.query(sql, (rs, i) -> {
            CrawlerTask t = new CrawlerTask();
            t.setId(rs.getString("id"));
            t.setQuery(rs.getString("query"));
            t.setSource(rs.getString("source"));
            t.setFrequency(rs.getString("frequency"));
            t.setLastRun(rs.getString("last_run")); // Simple String mapping
            t.setNextRun(rs.getString("next_run"));
            t.setStatus(rs.getString("status"));
            return t;
        });
    }

    public void create(CrawlerTask t) {
        String sql = """
            INSERT INTO crawler_tasks(id, query, source, frequency, next_run, status, created_at)
            VALUES(:id, :query, :source, :frequency, :nextRun, :status, NOW())
        """;
        Map<String, Object> p = new HashMap<>();
        p.put("id", t.getId());
        p.put("query", t.getQuery());
        p.put("source", t.getSource());
        p.put("frequency", t.getFrequency());
        p.put("nextRun", t.getNextRun());
        p.put("status", t.getStatus());
        jdbc.update(sql, p);
    }

    public void delete(String id) {
        jdbc.update("DELETE FROM crawler_tasks WHERE id=:id", Map.of("id", id));
    }

    public void updateStatus(String id, String status) {
        jdbc.update("UPDATE crawler_tasks SET status=:status WHERE id=:id", Map.of("id", id, "status", status));
    }

    public Optional<CrawlerTask> findById(String id) {
        String sql = "SELECT id, query, source, frequency, last_run, next_run, status FROM crawler_tasks WHERE id=:id";
        List<CrawlerTask> list = jdbc.query(sql, Map.of("id", id), (rs, i) -> {
            CrawlerTask t = new CrawlerTask();
            t.setId(rs.getString("id"));
            t.setQuery(rs.getString("query"));
            t.setSource(rs.getString("source"));
            t.setFrequency(rs.getString("frequency"));
            t.setLastRun(rs.getString("last_run"));
            t.setNextRun(rs.getString("next_run"));
            t.setStatus(rs.getString("status"));
            return t;
        });
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    public void updateExecutionState(String id, String status, String lastRun, String nextRun) {
        String sql = """
            UPDATE crawler_tasks 
            SET status=:status, last_run=:lastRun, next_run=:nextRun 
            WHERE id=:id
        """;
        Map<String, Object> params = new HashMap<>();
        params.put("id", id);
        params.put("status", status);
        params.put("lastRun", lastRun);
        params.put("nextRun", nextRun);
        jdbc.update(sql, params);
    }
}
