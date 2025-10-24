package com.resume.resumeai.service;

import com.resume.resumeai.domain.Resume;
import com.resume.resumeai.domain.dto.ResumeCreateRequest;
import com.resume.resumeai.domain.dto.ResumeUpdateRequest;
import com.resume.resumeai.repository.ResumeRepository;
import com.resume.resumeai.util.PageUtil;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResumeService {
    private final ResumeRepository resumeRepository;
    public ResumeService(ResumeRepository resumeRepository) { this.resumeRepository = resumeRepository; }

    public Resume create(ResumeCreateRequest req) {
        Resume r = new Resume();
        r.setUserId(req.getUserId());
        r.setTitle(req.getTitle());
        r.setContentJson(req.getContentJson());
        r.setStatus("draft");
        return resumeRepository.create(r);
    }

    public Resume getById(Long id) { return resumeRepository.findById(id); }

    public Resume update(Long id, ResumeUpdateRequest req) {
        Resume r = resumeRepository.findById(id);
        if (r == null) throw new IllegalArgumentException("Resume not found");
        r.setTitle(req.getTitle());
        r.setContentJson(req.getContentJson());
        r.setStatus(req.getStatus());
        resumeRepository.update(r);
        return resumeRepository.findById(id);
    }

    public boolean delete(Long id) { return resumeRepository.delete(id) > 0; }

    public List<Resume> list(int page, int pageSize, String status) {
        int offset = PageUtil.offset(page, pageSize);
        return resumeRepository.list(offset, pageSize, status);
    }

    public int count(String status) { return resumeRepository.count(status); }

    public Resume duplicate(Long id) { return resumeRepository.duplicate(id); }
}