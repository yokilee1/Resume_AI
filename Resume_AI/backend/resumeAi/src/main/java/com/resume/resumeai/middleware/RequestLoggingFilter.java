package com.resume.resumeai.middleware;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.nio.charset.StandardCharsets;
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

        ContentCachingRequestWrapper requestWrapper = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(response);

        try {
            String url = request.getRequestURI();
            String method = request.getMethod();
            String ip = getClientIp(request);
            log.info("[REQ START] {} {} IP={}", method, url, ip);

            chain.doFilter(requestWrapper, responseWrapper);

            long cost = System.currentTimeMillis() - start;
            int status = response.getStatus();

            // 记录请求与响应报文
            String reqBody = getPayload(requestWrapper.getContentAsByteArray(), request.getContentType());
            String respBody = getPayload(responseWrapper.getContentAsByteArray(), response.getContentType());
            
            if (reqBody != null && !reqBody.isBlank()) log.info("[BODY REQ] {}", reqBody);
            if (respBody != null && !respBody.isBlank()) log.info("[BODY RESP] {}", respBody);

            log.info("[REQ END] {} {} -> {} ({}ms)", method, url, status, cost);
            
            // 关键：将缓存的内容复制回原始响应流
            responseWrapper.copyBodyToResponse();
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

    private String getPayload(byte[] buf, String contentType) {
        if (buf == null || buf.length == 0) return null;
        if (contentType != null && (contentType.contains("json") || contentType.contains("text") || contentType.contains("xml"))) {
            return new String(buf, 0, Math.min(buf.length, 4096), StandardCharsets.UTF_8);
        }
        return "[Binary or Non-Text Content]";
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