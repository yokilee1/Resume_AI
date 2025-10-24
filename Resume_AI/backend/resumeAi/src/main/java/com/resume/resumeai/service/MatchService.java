package com.resume.resumeai.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class MatchService {
    public Map<String, Object> recommend(Map<String, Object> payload) {
        // TODO: 注入 JobRepository / TextMatcher，返回排序后的岗位
        return Map.of("items", List.of(), "explain", "placeholder scoring");
    }
}