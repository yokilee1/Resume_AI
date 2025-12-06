package com.resume.resumeai.api;

import com.resume.resumeai.advice.ApiResponse;
import com.resume.resumeai.domain.dto.ai.*;
import com.resume.resumeai.service.AiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@Tag(name = "AI", description = "基于 OpenAI 的智能服务")
@io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
public class AiController {
    private final AiService aiService;
    public AiController(AiService aiService) { this.aiService = aiService; }

    /**
     * 简历润色
     */
    @PostMapping("/polish")
    @Operation(summary = "简历润色", description = "调用 OpenAI 对简历进行语法修正、表达优化与内容增强，支持行业/职位定制")
    public ApiResponse<ResumePolishResponse> polish(@Valid @RequestBody ResumePolishRequest req) {
        return ApiResponse.ok(aiService.polish(req));
    }

    /**
     * 岗位推荐
     */
    @PostMapping("/recommend-jobs")
    @Operation(summary = "岗位推荐", description = "基于简历内容智能推荐岗位，支持排序与过滤")
    public ApiResponse<JobRecommendResponse> recommend(@Valid @RequestBody JobRecommendRequest req,
                                                       @Parameter(description = "排序方式：score_desc") @RequestParam(required=false) String sort,
                                                       @Parameter(description = "最低匹配分") @RequestParam(required=false) Double minScore,
                                                       @Parameter(description = "按城市过滤") @RequestParam(required=false) String city) {
        return ApiResponse.ok(aiService.recommend(req, sort, minScore, city));
    }

    /**
     * 岗位匹配度评估
     */
    @PostMapping("/match-report")
    @Operation(summary = "岗位匹配度评估", description = "分析技能匹配度、经验相关性与文化适配性，生成详细评分与改进建议")
    public ApiResponse<MatchReportResponse> matchReport(@Valid @RequestBody MatchReportRequest req) {
        return ApiResponse.ok(aiService.matchReport(req));
    }
}

