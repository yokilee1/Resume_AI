package com.resume.resumeai.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthAndResumeFlowTest {
    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @Test
    @DisplayName("注册->登录->创建简历->列表->更新->删除 全流程")
    void endToEndFlow() throws Exception {
        String email = "user1@example.com";
        String password = "Password123!";
        String nickname = "User One";

        // 注册
        String regResp = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\",\"password\":\"" + password + "\",\"nickname\":\"" + nickname + "\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JsonNode regNode = objectMapper.readTree(regResp);
        assertThat(regNode.get("success").asBoolean()).isTrue();

        // 登录
        String loginResp = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JsonNode loginNode = objectMapper.readTree(loginResp);
        String token = loginNode.get("data").get("accessToken").asText();
        assertThat(token).isNotBlank();

        // 创建简历
        String createResp = mockMvc.perform(post("/api/resumes")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"我的简历\",\"content_json\":\"{\\\"skills\\\":\\\"Java Vue SQL\\\"}\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        JsonNode createNode = objectMapper.readTree(createResp);
        long resumeId = createNode.get("data").get("id").asLong();
        assertThat(resumeId).isGreaterThan(0);

        // 列表
        String listResp = mockMvc.perform(get("/api/resumes?page=1&pageSize=10")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        JsonNode listNode = objectMapper.readTree(listResp);
        assertThat(listNode.get("data").get("items").isArray()).isTrue();

        // 更新
        String updateResp = mockMvc.perform(put("/api/resumes/" + resumeId)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"我的简历(更新)\",\"content_json\":\"{\\\"skills\\\":\\\"Java Spring\\\"}\",\"status\":\"DRAFT\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        JsonNode updateNode = objectMapper.readTree(updateResp);
        assertThat(updateNode.get("data").get("title").asText()).contains("更新");

        // 删除
        mockMvc.perform(delete("/api/resumes/" + resumeId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }
}