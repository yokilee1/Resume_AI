package com.resume.resumeai.middleware;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.web.filter.OncePerRequestFilter;

import java.util.UUID;

public class RequestLoggingFilter extends OncePerRequestFilter {
    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);
    /**
     * 记录每次请求的耗时与状态码；当发生异常时保留 SecurityException 的类型并记录错误日志
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) {
        String traceId = UUID.randomUUID().toString().substring(0, 8);
        MDC.put("traceId", traceId);
        long start = System.currentTimeMillis();
        try {
            String url = request.getRequestURI();
            String method = request.getMethod();
            String ip = getClientIp(request);
            String ua = request.getHeader("User-Agent");
            log.info("[REQ START] {} {} IP={} UA={}", method, url, ip, ua);

            chain.doFilter(request, response);

            long cost = System.currentTimeMillis() - start;
            int status = response.getStatus();
            log.info("[REQ END] {} {} -> {} ({}ms)", method, url, status, cost);
        } catch (Exception e) {
            long cost = System.currentTimeMillis() - start;
            log.error("[REQ ERROR] {} {} -> 500 ({}ms)", request.getMethod(), request.getRequestURI(), cost, e);
            if (e instanceof SecurityException) {
                throw (SecurityException) e;
            }
            throw new RuntimeException(e);
        } finally {
            MDC.clear();
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}