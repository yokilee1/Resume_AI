package com.resume.resumeai.middleware;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

public class RequestLoggingFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) {
        try {
            long start = System.currentTimeMillis();
            chain.doFilter(request, response);
            long cost = System.currentTimeMillis() - start;
            String path = request.getRequestURI();
            System.out.println("[REQ] " + request.getMethod() + " " + path + " -> " + response.getStatus() + " (" + cost + "ms)");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}