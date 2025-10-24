package com.resume.resumeai.api;

import com.resume.resumeai.advice.ApiResponse;
import com.resume.resumeai.domain.Resume;
import com.resume.resumeai.domain.dto.ResumeCreateRequest;
import com.resume.resumeai.domain.dto.ResumeUpdateRequest;
import com.resume.resumeai.service.ResumeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {
    private final ResumeService resumeService;
    public ResumeController(ResumeService resumeService) { this.resumeService = resumeService; }

    @PostMapping
    public ApiResponse<Resume> create(@RequestBody ResumeCreateRequest req) {
        return ApiResponse.ok(resumeService.create(req));
    }

    @GetMapping("/{id}")
    public ApiResponse<Resume> get(@PathVariable Long id) {
        return ApiResponse.ok(resumeService.getById(id));
    }

    @PutMapping("/{id}")
    public ApiResponse<Resume> update(@PathVariable Long id, @RequestBody ResumeUpdateRequest req) {
        return ApiResponse.ok(resumeService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Boolean> delete(@PathVariable Long id) {
        return ApiResponse.ok(resumeService.delete(id));
    }

    @GetMapping
    public ApiResponse<Map<String, Object>> list(@RequestParam(defaultValue="1") int page,
                                                 @RequestParam(defaultValue="10") int pageSize,
                                                 @RequestParam(required=false) String status) {
        List<Resume> items = resumeService.list(page, pageSize, status);
        int total = resumeService.count(status);
        return ApiResponse.ok(Map.of("items", items, "page", page, "pageSize", pageSize, "total", total));
    }

    @PostMapping("/{id}/duplicate")
    public ApiResponse<Resume> duplicate(@PathVariable Long id) {
        return ApiResponse.ok(resumeService.duplicate(id));
    }
}