package com.resume.resumeai.middleware;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.filter.OncePerRequestFilter;

public class RequestLoggingFilter extends OncePerRequestFilter {
    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);
    /**
     * 记录每次请求的耗时与状态码；当发生异常时保留 SecurityException 的类型并记录错误日志
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) {
        try {
            long start = System.currentTimeMillis();
            chain.doFilter(request, response);
            long cost = System.currentTimeMillis() - start;
            String path = request.getRequestURI();
            log.info("[REQ] {} {} -> {} ({}ms)", request.getMethod(), path, response.getStatus(), cost);
        } catch (Exception e) {
            if (e instanceof SecurityException) {
                throw (SecurityException) e;
            }
            log.error("request failed: {} {}", request.getMethod(), request.getRequestURI(), e);
            throw new RuntimeException(e);
        }
    }
}