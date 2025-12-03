package com.resume.resumeai.api;

import com.resume.resumeai.advice.ApiResponse;
import com.resume.resumeai.domain.dto.LoginRequest;
import com.resume.resumeai.domain.dto.RegisterRequest;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.resume.resumeai.service.AuthService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "认证与令牌管理")
public class AuthController {

    private final AuthService authService;
    public AuthController(AuthService authService) { this.authService = authService; }

    @PostMapping("/register")
    @Operation(summary = "注册用户", description = "创建新用户并返回访问令牌")
    public ApiResponse<Map<String, Object>> register(@RequestBody @Valid RegisterRequest req) {
        return ApiResponse.ok(authService.register(req));
    }

    @PostMapping("/login")
    @Operation(summary = "登录", description = "通过邮箱与密码登录并返回访问令牌")
    public ApiResponse<Map<String, Object>> login(@RequestBody @Valid LoginRequest req) {
        return ApiResponse.ok(authService.login(req));
    }

    @PostMapping("/refresh")
    @Operation(summary = "刷新令牌", description = "通过Authorization头的旧令牌换取新令牌")
    public ApiResponse<Map<String, Object>> refresh(@RequestHeader("Authorization") String authorization) {
        return ApiResponse.ok(authService.refresh(authorization));
    }
}