package com.resume.resumeai.api;

import com.resume.resumeai.advice.ApiResponse;
import com.resume.resumeai.domain.JobPosition;
import com.resume.resumeai.service.JobService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {
    private final JobService jobService;
    public JobController(JobService jobService) { this.jobService = jobService; }

    @GetMapping("/search")
    public ApiResponse<Map<String, Object>> search(@RequestParam(required=false) String keywords,
                                                   @RequestParam(required=false) String city,
                                                   @RequestParam(defaultValue="1") int page,
                                                   @RequestParam(defaultValue="10") int pageSize) {
        List<JobPosition> items = jobService.search(keywords, city, page, pageSize);
        int total = jobService.count(keywords, city);
        return ApiResponse.ok(Map.of("items", items, "page", page, "pageSize", pageSize, "total", total));
    }
}