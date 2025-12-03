package com.resume.resumeai.api;

import com.resume.resumeai.advice.ApiResponse;
import com.resume.resumeai.domain.Resume;
import com.resume.resumeai.domain.dto.ResumeCreateRequest;
import com.resume.resumeai.domain.dto.ResumeUpdateRequest;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.resume.resumeai.service.ResumeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
@Tag(name = "Resume", description = "简历管理接口")
@io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
public class ResumeController {
    private final ResumeService resumeService;
    public ResumeController(ResumeService resumeService) { this.resumeService = resumeService; }

    @PostMapping
    @Operation(summary = "创建简历", description = "根据请求体创建当前用户的简历")
    public ApiResponse<Resume> create(@RequestBody @Valid ResumeCreateRequest req) {
        return ApiResponse.ok(resumeService.create(req));
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取简历", description = "按ID获取当前用户拥有的简历")
    public ApiResponse<Resume> get(@PathVariable Long id) {
        return ApiResponse.ok(resumeService.getById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新简历", description = "更新当前用户拥有的简历内容")
    public ApiResponse<Resume> update(@PathVariable Long id, @RequestBody @Valid ResumeUpdateRequest req) {
        return ApiResponse.ok(resumeService.update(id, req));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除简历", description = "删除当前用户拥有的简历")
    public ApiResponse<Boolean> delete(@PathVariable Long id) {
        return ApiResponse.ok(resumeService.delete(id));
    }

    @GetMapping
    @Operation(summary = "简历列表", description = "分页列出当前用户的简历")
    public ApiResponse<Map<String, Object>> list(@RequestParam(defaultValue="1") int page,
                                                 @RequestParam(defaultValue="10") int pageSize,
                                                 @RequestParam(required=false) String status) {
        List<Resume> items = resumeService.list(page, pageSize, status);
        int total = resumeService.count(status);
        return ApiResponse.ok(Map.of("items", items, "page", page, "pageSize", pageSize, "total", total));
    }

    @PostMapping("/{id}/duplicate")
    @Operation(summary = "复制简历", description = "复制当前用户的简历，生成新草稿")
    public ApiResponse<Resume> duplicate(@PathVariable Long id) {
        return ApiResponse.ok(resumeService.duplicate(id));
    }
}