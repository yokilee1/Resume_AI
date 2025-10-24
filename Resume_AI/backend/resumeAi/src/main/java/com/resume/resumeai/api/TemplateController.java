package com.resume.resumeai.api;

import com.resume.resumeai.advice.ApiResponse;
import com.resume.resumeai.domain.Template;
import com.resume.resumeai.service.TemplateService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/templates")
public class TemplateController {
    private final TemplateService templateService;
    public TemplateController(TemplateService templateService) { this.templateService = templateService; }

    @GetMapping
    public ApiResponse<List<Template>> list(@RequestParam(required=false) String category) {
        return ApiResponse.ok(templateService.list(category));
    }

    @GetMapping("/{id}")
    public ApiResponse<Template> get(@PathVariable Long id) {
        return ApiResponse.ok(templateService.getById(id));
    }
}