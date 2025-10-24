package com.resume.resumeai.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordUtil {
    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    public static String hash(String raw) { return encoder.encode(raw); }
    public static boolean verify(String raw, String hash) { return encoder.matches(raw, hash); }
}