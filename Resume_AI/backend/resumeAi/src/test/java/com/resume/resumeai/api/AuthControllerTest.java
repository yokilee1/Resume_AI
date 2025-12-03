package com.resume.resumeai.api;

import com.resume.resumeai.service.AuthService;
import com.resume.resumeai.domain.dto.LoginRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;
import java.util.logging.Logger;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Test
    @DisplayName("登录成功返回 OK 与 token")
    void login_success() throws Exception {
        String token = "stub.jwt.token";
        when(authService.login(any(LoginRequest.class))).thenReturn(Map.of("token", token));

        String body = "{\"email\":\"alice@example.com\",\"password\":\"password\"}";
        String result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is("OK")))
                .andExpect(jsonPath("$.message", is("success")))
                .andExpect(jsonPath("$.data.token", is(token)))
                .toString();
    }

    @Test
    @DisplayName("刷新 token 成功返回 OK 与 token")
    void refresh_success() throws Exception {
        String token = "new.jwt.token";
        when(authService.refresh(anyString())).thenReturn(Map.of("token", token));

        mockMvc.perform(post("/api/auth/refresh")
                        .header("Authorization", "Bearer old.jwt.token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is("OK")))
                .andExpect(jsonPath("$.message", is("success")))
                .andExpect(jsonPath("$.data.token", is(token)));
    }
}