package com.resume.resumeai.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtil {
    private SecurityUtil() {}

    public static Long getCurrentUserIdOrThrow() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            throw new SecurityException("Unauthenticated");
        }
        Object p = auth.getPrincipal();
        try {
            if (p instanceof String s) return Long.parseLong(s);
            if (p instanceof Long l) return l;
            return Long.parseLong(p.toString());
        } catch (Exception e) {
            throw new SecurityException("Invalid principal");
        }
    }
}