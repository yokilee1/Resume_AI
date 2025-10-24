package com.resume.resumeai.api;

import com.resume.resumeai.advice.ApiResponse;
import com.resume.resumeai.service.MatchService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/match")
public class MatchController {
    private final MatchService matchService;
    public MatchController(MatchService matchService) { this.matchService = matchService; }

    @PostMapping("/recommendations")
    public ApiResponse<Map<String, Object>> recommend(@RequestBody Map<String, Object> payload) {
        return ApiResponse.ok(matchService.recommend(payload));
    }
}