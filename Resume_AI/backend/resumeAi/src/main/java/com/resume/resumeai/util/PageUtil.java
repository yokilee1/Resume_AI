package com.resume.resumeai.util;

public class PageUtil {
    public static int offset(int page, int size) {
        if (page <= 1) return 0;
        return (page - 1) * size;
    }
}