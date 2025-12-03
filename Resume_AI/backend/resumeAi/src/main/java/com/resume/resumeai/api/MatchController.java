package com.resume.resumeai.api;

import com.resume.resumeai.advice.ApiResponse;
import com.resume.resumeai.service.MatchService;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Map;

@RestController
@RequestMapping("/api/match")
@Tag(name = "Match", description = "简历与职位匹配接口")
@io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
public class MatchController {
    private final MatchService matchService;
    public MatchController(MatchService matchService) { this.matchService = matchService; }

    @PostMapping("/recommendations")
    @Operation(summary = "岗位推荐", description = "根据简历文本或关键词推荐相关岗位")
    public ApiResponse<Map<String, Object>> recommend(@RequestBody Map<String, Object> payload) {
        return ApiResponse.ok(matchService.recommend(payload));
    }
}