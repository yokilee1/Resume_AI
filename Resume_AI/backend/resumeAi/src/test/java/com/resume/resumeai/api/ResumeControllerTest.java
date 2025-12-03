package com.resume.resumeai.api;

import com.resume.resumeai.domain.Resume;
import com.resume.resumeai.domain.dto.ResumeCreateRequest;
import com.resume.resumeai.service.ResumeService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = ResumeController.class)
@AutoConfigureMockMvc(addFilters = false)
class ResumeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ResumeService resumeService;

    @Test
    @DisplayName("创建简历成功返回 OK 与简历数据")
    void create_success() throws Exception {
        Resume r = new Resume();
        r.setId(100L);
        r.setUserId(1L);
        r.setTitle("My Resume");
        when(resumeService.create(any(ResumeCreateRequest.class))).thenReturn(r);

        String body = "{\"userId\":1,\"title\":\"My Resume\",\"content\":\"...\"}";
        mockMvc.perform(post("/api/resumes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is("OK")))
                .andExpect(jsonPath("$.message", is("success")))
                .andExpect(jsonPath("$.data.id", is(100)))
                .andExpect(jsonPath("$.data.title", is("My Resume")));
    }

    @Test
    @DisplayName("列表接口返回分页结构与总数")
    void list_success() throws Exception {
        Resume a = new Resume(); a.setId(1L); a.setUserId(1L); a.setTitle("A");
        Resume b = new Resume(); b.setId(2L); b.setUserId(1L); b.setTitle("B");
        when(resumeService.list(anyInt(), anyInt(), any())).thenReturn(List.of(a, b));
        when(resumeService.count(any())).thenReturn(2);

        mockMvc.perform(get("/api/resumes?page=1&pageSize=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is("OK")))
                .andExpect(jsonPath("$.message", is("success")))
                .andExpect(jsonPath("$.data.total", is(2)))
                .andExpect(jsonPath("$.data.items", hasSize(2)))
                .andExpect(jsonPath("$.data.items[0].title", is("A")))
                .andExpect(jsonPath("$.data.items[1].title", is("B")));
    }
}