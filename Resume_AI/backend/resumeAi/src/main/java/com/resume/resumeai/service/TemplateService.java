package com.resume.resumeai.service;

import com.resume.resumeai.domain.Template;
import com.resume.resumeai.repository.TemplateRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TemplateService {
    private final TemplateRepository templateRepository;
    public TemplateService(TemplateRepository templateRepository) { this.templateRepository = templateRepository; }

    public List<Template> list(String category) { return templateRepository.list(category); }
    public Template getById(Long id) { return templateRepository.findById(id); }
}