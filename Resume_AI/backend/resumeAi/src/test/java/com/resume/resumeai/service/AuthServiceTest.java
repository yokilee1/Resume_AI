package com.resume.resumeai.service;

import com.resume.resumeai.domain.User;
import com.resume.resumeai.domain.dto.LoginRequest;
import com.resume.resumeai.domain.dto.RegisterRequest;
import com.resume.resumeai.repository.UserRepository;
import com.resume.resumeai.security.JwtUtil;
import com.resume.resumeai.util.PasswordUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    private AuthService authService;
    private UserRepository userRepository;
    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        jwtUtil = mock(JwtUtil.class);
        authService = new AuthService(userRepository, jwtUtil);
    }

    @Test
    @DisplayName("register: 成功注册并返回 token")
    void register_success() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("test@example.com");
        req.setPassword("pass");
        req.setNickname("nick");

        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(jwtUtil.issueToken(any(), anyString())).thenReturn("mock-token");
        doAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(1L);
            return null;
        }).when(userRepository).create(any(User.class));

        Map<String, Object> result = authService.register(req);

        assertThat(result.get("token")).isEqualTo("mock-token");
        verify(userRepository).create(any(User.class));
    }

    @Test
    @DisplayName("register: 邮箱已存在应抛出异常")
    void register_duplicate_email() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("exists@example.com");
        when(userRepository.existsByEmail("exists@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("exists");
    }

    @Test
    @DisplayName("login: 成功登录")
    void login_success() {
        LoginRequest req = new LoginRequest();
        req.setEmail("user@example.com");
        req.setPassword("password");

        User u = new User();
        u.setId(1L);
        u.setEmail("user@example.com");
        u.setPasswordHash(PasswordUtil.hash("password"));
        
        when(userRepository.findByEmail("user@example.com")).thenReturn(u);
        when(jwtUtil.issueToken(1L, "user@example.com")).thenReturn("mock-token");

        Map<String, Object> result = authService.login(req);
        assertThat(result.get("token")).isEqualTo("mock-token");
    }

    @Test
    @DisplayName("login: 密码错误抛出异常")
    void login_wrong_password() {
        LoginRequest req = new LoginRequest();
        req.setEmail("user@example.com");
        req.setPassword("wrong");

        User u = new User();
        u.setPasswordHash(PasswordUtil.hash("correct"));
        when(userRepository.findByEmail("user@example.com")).thenReturn(u);

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
