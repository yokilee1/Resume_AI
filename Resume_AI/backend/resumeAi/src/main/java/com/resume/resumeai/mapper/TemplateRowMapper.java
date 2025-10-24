package com.resume.resumeai.mapper;

import com.resume.resumeai.domain.Template;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class TemplateRowMapper implements RowMapper<Template> {
    @Override
    public Template mapRow(ResultSet rs, int rowNum) throws SQLException {
        Template t = new Template();
        t.setId(rs.getLong("id"));
        t.setName(rs.getString("name"));
        t.setCategory(rs.getString("category"));
        t.setPreviewUrl(rs.getString("preview_url"));
        t.setSchemaJson(rs.getString("schema_json"));
        return t;
    }
}