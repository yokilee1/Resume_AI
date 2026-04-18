package com.resume.resumeai.service;

import com.resume.resumeai.domain.Resume;
import com.resume.resumeai.domain.dto.ResumeCreateRequest;
import com.resume.resumeai.domain.dto.ResumeUpdateRequest;
import com.resume.resumeai.repository.ResumeRepository;
import com.resume.resumeai.security.SecurityUtil;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ResumeServiceTest {

    private ResumeService resumeService;
    private ResumeRepository resumeRepository;
    private MockedStatic<SecurityUtil> mockedSecurityUtil;

    @BeforeEach
    void setUp() {
        resumeRepository = mock(ResumeRepository.class);
        resumeService = new ResumeService(resumeRepository);
        mockedSecurityUtil = mockStatic(SecurityUtil.class);
    }

    @AfterEach
    void tearDown() {
        mockedSecurityUtil.close();
    }

    @Test
    @DisplayName("create: 成功保存简历并将当前用户 ID 设置为所属者")
    void create_success() {
        mockedSecurityUtil.when(SecurityUtil::getCurrentUserIdOrThrow).thenReturn(1L);
        ResumeCreateRequest req = new ResumeCreateRequest();
        req.setTitle("New Resume");
        req.setContentJson("{}");

        when(resumeRepository.create(any(Resume.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Resume result = resumeService.create(req);

        assertThat(result.getUserId()).isEqualTo(1L);
        assertThat(result.getTitle()).isEqualTo("New Resume");
        verify(resumeRepository).create(any(Resume.class));
    }

    @Test
    @DisplayName("getById: 访问他人的简历应抛出 SecurityException")
    void getById_forbidden() {
        mockedSecurityUtil.when(SecurityUtil::getCurrentUserIdOrThrow).thenReturn(1L);
        Resume r = new Resume();
        r.setId(100L);
        r.setUserId(2L); // Different user
        when(resumeRepository.findById(100L)).thenReturn(r);

        assertThatThrownBy(() -> resumeService.getById(100L))
                .isInstanceOf(SecurityException.class)
                .hasMessage("Forbidden");
    }

    @Test
    @DisplayName("update: 更新不存在的简历应抛出 IllegalArgumentException")
    void update_notFound() {
        mockedSecurityUtil.when(SecurityUtil::getCurrentUserIdOrThrow).thenReturn(1L);
        when(resumeRepository.findById(anyLong())).thenReturn(null);

        ResumeUpdateRequest req = new ResumeUpdateRequest();
        assertThatThrownBy(() -> resumeService.update(999L, req))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("list: 调用 repository 并正确转换页码为 offset")
    void list_logic() {
        mockedSecurityUtil.when(SecurityUtil::getCurrentUserIdOrThrow).thenReturn(1L);
        resumeService.list(2, 10, "draft");
        
        // Page 2, Size 10 => Offset 10
        verify(resumeRepository).listByUser(eq(1L), eq(10), eq(10), eq("draft"));
    }

    @Test
    @DisplayName("duplicate: 成功调用 repository 的复制方法")
    void duplicate_success() {
        mockedSecurityUtil.when(SecurityUtil::getCurrentUserIdOrThrow).thenReturn(1L);
        Resume r = new Resume();
        r.setUserId(1L);
        when(resumeRepository.findById(10L)).thenReturn(r);
        
        resumeService.duplicate(10L);
        verify(resumeRepository).duplicate(10L);
    }
}
