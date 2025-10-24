package com.resume.resumeai.api;

import com.resume.resumeai.advice.ApiResponse;
import com.resume.resumeai.domain.User;
import com.resume.resumeai.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    public UserController(UserService userService) { this.userService = userService; }

    @GetMapping("/me")
    public ApiResponse<User> me() {
        return ApiResponse.ok(userService.getCurrentUser());
    }

    @PatchMapping("/me")
    public ApiResponse<User> updateMe(@RequestBody User patch) {
        return ApiResponse.ok(userService.updateCurrentUser(patch));
    }
}