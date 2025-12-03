package com.resume.resumeai.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.resume.resumeai.domain.Resume;
import com.resume.resumeai.domain.dto.ResumeCreateRequest;
import com.resume.resumeai.domain.dto.ResumeUpdateRequest;
import com.resume.resumeai.repository.ResumeRepository;
import com.resume.resumeai.security.SecurityUtil;
import com.resume.resumeai.util.PageUtil;

@Service
public class ResumeService {
    private final ResumeRepository resumeRepository;
    public ResumeService(ResumeRepository resumeRepository) { this.resumeRepository = resumeRepository; }

    public Resume create(ResumeCreateRequest req) {
        Long currentUserId = SecurityUtil.getCurrentUserIdOrThrow();
        Resume r = new Resume();
        r.setUserId(currentUserId);
        r.setTitle(req.getTitle());
        r.setContentJson(req.getContentJson());
        r.setStatus("draft");
        return resumeRepository.create(r);
    }

    public Resume getById(Long id) {
        Long currentUserId = SecurityUtil.getCurrentUserIdOrThrow();
        Resume r = resumeRepository.findById(id);
        if (r == null) return null;
        if (!r.getUserId().equals(currentUserId)) throw new SecurityException("Forbidden");
        return r;
    }

    public Resume update(Long id, ResumeUpdateRequest req) {
        Long currentUserId = SecurityUtil.getCurrentUserIdOrThrow();
        Resume r = resumeRepository.findById(id);
        if (r == null) throw new IllegalArgumentException("Resume not found");
        if (!r.getUserId().equals(currentUserId)) throw new SecurityException("Forbidden");
        r.setTitle(req.getTitle());
        r.setContentJson(req.getContentJson());
        r.setStatus(req.getStatus());
        resumeRepository.update(r);
        return resumeRepository.findById(id);
    }

    public boolean delete(Long id) {
        Long currentUserId = SecurityUtil.getCurrentUserIdOrThrow();
        Resume r = resumeRepository.findById(id);
        if (r == null) return false;
        if (!r.getUserId().equals(currentUserId)) throw new SecurityException("Forbidden");
        return resumeRepository.delete(id) > 0;
    }

    /**
     * 分页查询当前用户的简历列表；当 status 为空字符串时视为不筛选
     */
    public List<Resume> list(int page, int pageSize, String status) {
        int offset = PageUtil.offset(page, pageSize);
        Long currentUserId = SecurityUtil.getCurrentUserIdOrThrow();
        String normalizedStatus = (status != null && status.trim().isEmpty()) ? null : status;
        return resumeRepository.listByUser(currentUserId, offset, pageSize, normalizedStatus);
    }

    /**
     * 统计当前用户的简历数量；当 status 为空字符串时视为不筛选
     */
    public int count(String status) {
        Long currentUserId = SecurityUtil.getCurrentUserIdOrThrow();
        String normalizedStatus = (status != null && status.trim().isEmpty()) ? null : status;
        return resumeRepository.countByUser(currentUserId, normalizedStatus);
    }

    public Resume duplicate(Long id) {
        Long currentUserId = SecurityUtil.getCurrentUserIdOrThrow();
        Resume r = resumeRepository.findById(id);
        if (r == null) return null;
        if (!r.getUserId().equals(currentUserId)) throw new SecurityException("Forbidden");
        return resumeRepository.duplicate(id);
    }
}