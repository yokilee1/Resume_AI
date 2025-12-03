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
            SELECT id, name, category, preview_url, schema_json
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
            return t;
        });
    }

    public Template findById(Long id) {
        List<Template> list = jdbc.query("SELECT id, name, category, preview_url, schema_json FROM templates WHERE id=:id",
                Map.of("id", id),
                (rs, i) -> {
                    Template t = new Template();
                    t.setId(rs.getLong("id"));
                    t.setName(rs.getString("name"));
                    t.setCategory(rs.getString("category"));
                    t.setPreviewUrl(rs.getString("preview_url"));
                    t.setSchemaJson(rs.getString("schema_json"));
                    return t;
                });
        return list.isEmpty() ? null : list.get(0);
    }
}