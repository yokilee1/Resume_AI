package com.resume.resumeai.repository;

import com.resume.resumeai.domain.Resume;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class ResumeRepository {
    private final NamedParameterJdbcTemplate jdbc;
    public ResumeRepository(NamedParameterJdbcTemplate jdbc) { this.jdbc = jdbc; }

    public Resume create(Resume r) {
        String sql = """
            INSERT INTO resumes(user_id, title, content_json, status, created_at, updated_at)
            VALUES(:user_id, :title, :content_json, :status, NOW(), NOW())
        """;
        Map<String, Object> p = new HashMap<>();
        p.put("user_id", r.getUserId());
        p.put("title", r.getTitle());
        p.put("content_json", r.getContentJson());
        p.put("status", r.getStatus());
        jdbc.update(sql, p);
        Long id = jdbc.queryForObject("SELECT LAST_INSERT_ID()", Map.of(), Long.class);
        r.setId(id);
        return r;
    }

    public Resume findById(Long id) {
        List<Resume> list = jdbc.query("SELECT id, user_id, title, content_json, status, created_at, updated_at FROM resumes WHERE id=:id",
                Map.of("id", id),
                (rs, i) -> {
                    Resume r = new Resume();
                    r.setId(rs.getLong("id"));
                    r.setUserId(rs.getLong("user_id"));
                    r.setTitle(rs.getString("title"));
                    r.setContentJson(rs.getString("content_json"));
                    r.setStatus(rs.getString("status"));
                    r.setCreatedAt(rs.getTimestamp("created_at").toInstant());
                    r.setUpdatedAt(rs.getTimestamp("updated_at").toInstant());
                    return r;
                });
        return list.isEmpty() ? null : list.get(0);
    }

    public void update(Resume r) {
        String sql = """
            UPDATE resumes SET title=:title, content_json=:content_json, status=:status, updated_at=NOW()
            WHERE id=:id
        """;
        Map<String, Object> p = new HashMap<>();
        p.put("title", r.getTitle());
        p.put("content_json", r.getContentJson());
        p.put("status", r.getStatus());
        p.put("id", r.getId());
        jdbc.update(sql, p);
    }

    public int delete(Long id) {
        return jdbc.update("DELETE FROM resumes WHERE id=:id", Map.of("id", id));
    }

    public List<Resume> list(int offset, int limit, String status) {
        String sql = """
            SELECT id, user_id, title, content_json, status, created_at, updated_at
            FROM resumes
            WHERE (:status IS NULL OR status=:status)
            ORDER BY updated_at DESC
            LIMIT :limit OFFSET :offset
        """;
        Map<String, Object> p = new HashMap<>();
        p.put("status", status);
        p.put("limit", limit);
        p.put("offset", offset);
        return jdbc.query(sql, p, (rs, i) -> {
            Resume r = new Resume();
            r.setId(rs.getLong("id"));
            r.setUserId(rs.getLong("user_id"));
            r.setTitle(rs.getString("title"));
            r.setContentJson(rs.getString("content_json"));
            r.setStatus(rs.getString("status"));
            r.setCreatedAt(rs.getTimestamp("created_at").toInstant());
            r.setUpdatedAt(rs.getTimestamp("updated_at").toInstant());
            return r;
        });
    }

    public int count(String status) {
        String sql = "SELECT COUNT(1) FROM resumes WHERE (:status IS NULL OR status=:status)";
        Integer r = jdbc.queryForObject(sql, Map.of("status", status), Integer.class);
        return r == null ? 0 : r;
    }

    public Resume duplicate(Long id) {
        Resume src = findById(id);
        if (src == null) return null;
        Resume copy = new Resume();
        copy.setUserId(src.getUserId());
        copy.setTitle(src.getTitle() + " (copy)");
        copy.setContentJson(src.getContentJson());
        copy.setStatus("draft");
        return create(copy);
    }
}