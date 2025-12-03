package com.resume.resumeai.api;

import com.resume.resumeai.advice.ApiResponse;
import com.resume.resumeai.domain.Template;
import com.resume.resumeai.service.TemplateService;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/templates")
@Tag(name = "Template", description = "简历模板接口")
@io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
public class TemplateController {
    private final TemplateService templateService;
    public TemplateController(TemplateService templateService) { this.templateService = templateService; }

    @GetMapping
    @Operation(summary = "模板列表", description = "按类别过滤模板列表")
    public ApiResponse<List<Template>> list(@RequestParam(required=false) String category) {
        return ApiResponse.ok(templateService.list(category));
    }

    @GetMapping("/{id}")
    @Operation(summary = "模板详情", description = "根据ID获取模板详情")
    public ApiResponse<Template> get(@PathVariable Long id) {
        return ApiResponse.ok(templateService.getById(id));
    }
}