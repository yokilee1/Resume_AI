package com.resume.resumeai.api;

import com.resume.resumeai.advice.ApiResponse;
import com.resume.resumeai.domain.JobPosition;
import com.resume.resumeai.service.JobService;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@Tag(name = "Job", description = "职位搜索接口")
@io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
public class JobController {
    private final JobService jobService;
    public JobController(JobService jobService) { this.jobService = jobService; }

    @GetMapping("/search")
    @Operation(summary = "搜索职位", description = "根据关键字与城市进行分页搜索")
    public ApiResponse<Map<String, Object>> search(@RequestParam(required=false) String keywords,
                                                   @RequestParam(required=false) String city,
                                                   @RequestParam(defaultValue="1") int page,
                                                   @RequestParam(defaultValue="10") int pageSize) {
        List<JobPosition> items = jobService.search(keywords, city, page, pageSize);
        int total = jobService.count(keywords, city);
        return ApiResponse.ok(Map.of("items", items, "page", page, "pageSize", pageSize, "total", total));
    }
}