package com.resume.resumeai.api;

import com.resume.resumeai.advice.ApiResponse;
import com.resume.resumeai.domain.User;
import com.resume.resumeai.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User", description = "用户资料接口")
@io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
public class UserController {
    private final UserService userService;
    public UserController(UserService userService) { this.userService = userService; }

    @GetMapping("/me")
    @Operation(summary = "当前用户资料", description = "获取已认证用户的资料")
    public ApiResponse<User> me() {
        return ApiResponse.ok(userService.getCurrentUser());
    }

    @PatchMapping("/me")
    @Operation(summary = "更新当前用户资料", description = "更新已认证用户的公开信息")
    public ApiResponse<User> updateMe(@RequestBody @Valid User patch) {
        return ApiResponse.ok(userService.updateCurrentUser(patch));
    }
}