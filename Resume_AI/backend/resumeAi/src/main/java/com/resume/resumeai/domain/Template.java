package com.resume.resumeai.domain;

public class Template {
    private Long id;
    private String name;
    private String category;
    private String previewUrl;
    private String schemaJson;
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getName() { return name; } public void setName(String name) { this.name = name; }
    public String getCategory() { return category; } public void setCategory(String category) { this.category = category; }
    public String getPreviewUrl() { return previewUrl; } public void setPreviewUrl(String previewUrl) { this.previewUrl = previewUrl; }
    public String getSchemaJson() { return schemaJson; } public void setSchemaJson(String schemaJson) { this.schemaJson = schemaJson; }
}