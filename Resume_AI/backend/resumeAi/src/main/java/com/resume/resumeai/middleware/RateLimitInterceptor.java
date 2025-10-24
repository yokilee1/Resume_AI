package com.resume.resumeai.middleware;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

public class RateLimitInterceptor implements HandlerInterceptor {
    private static class Window { int hits; long start; }
    private final ConcurrentHashMap<String, Window> map = new ConcurrentHashMap<>();
    private final int limitPerWindow = 100;
    private final long windowMs = 60_000;

    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) {
        String key = (req.getRemoteAddr() + ":" + req.getRequestURI());
        Window w = map.computeIfAbsent(key, k -> { Window nw = new Window(); nw.hits = 0; nw.start = Instant.now().toEpochMilli(); return nw; });
        long now = Instant.now().toEpochMilli();
        if (now - w.start > windowMs) { w.hits = 0; w.start = now; }
        w.hits++;
        if (w.hits > limitPerWindow) {
            res.setStatus(429);
            return false;
        }
        return true;
    }
}