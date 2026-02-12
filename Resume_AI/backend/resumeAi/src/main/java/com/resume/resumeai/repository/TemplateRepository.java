package com.resume.resumeai.repository;

import com.resume.resumeai.domain.Template;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class TemplateRepository {
    private final NamedParameterJdbcTemplate jdbc;
    public TemplateRepository(NamedParameterJdbcTemplate jdbc) { this.jdbc = jdbc; }

    public List<Template> list(String category) {
        String sql = """
            SELECT id, name, category, preview_url, schema_json, status, usage_count
            FROM templates
            WHERE (:category IS NULL OR category=:category)
            ORDER BY id DESC
        """;
        Map<String, Object> p = new HashMap<>();
        p.put("category", category);
        return jdbc.query(sql, p, (rs, i) -> {
            Template t = new Template();
            t.setId(rs.getLong("id"));
            t.setName(rs.getString("name"));
            t.setCategory(rs.getString("category"));
            t.setPreviewUrl(rs.getString("preview_url"));
            t.setSchemaJson(rs.getString("schema_json"));
            t.setStatus(rs.getString("status"));
            t.setUsageCount(rs.getInt("usage_count"));
            return t;
        });
    }

    public Template findById(Long id) {
        List<Template> list = jdbc.query("SELECT id, name, category, preview_url, schema_json, status, usage_count FROM templates WHERE id=:id",
                Map.of("id", id),
                (rs, i) -> {
                    Template t = new Template();
                    t.setId(rs.getLong("id"));
                    t.setName(rs.getString("name"));
                    t.setCategory(rs.getString("category"));
                    t.setPreviewUrl(rs.getString("preview_url"));
                    t.setSchemaJson(rs.getString("schema_json"));
                    t.setStatus(rs.getString("status"));
                    t.setUsageCount(rs.getInt("usage_count"));
                    return t;
                });
        return list.isEmpty() ? null : list.get(0);
    }

    public void updateStatus(Long id, String status) {
        jdbc.update("UPDATE templates SET status=:status WHERE id=:id", Map.of("status", status, "id", id));
    }

    public void create(Template t) {
        String sql = """
            INSERT INTO templates(name, category, preview_url, schema_json, status, usage_count)
            VALUES(:name, :category, :previewUrl, :schemaJson, :status, :usageCount)
        """;
        Map<String, Object> p = new HashMap<>();
        p.put("name", t.getName());
        p.put("category", t.getCategory());
        p.put("previewUrl", t.getPreviewUrl());
        p.put("schemaJson", t.getSchemaJson());
        p.put("status", t.getStatus());
        p.put("usageCount", t.getUsageCount() != null ? t.getUsageCount() : 0);
        jdbc.update(sql, p);
    }

    public void deleteById(Long id) {
        jdbc.update("DELETE FROM templates WHERE id=:id", Map.of("id", id));
    }
}