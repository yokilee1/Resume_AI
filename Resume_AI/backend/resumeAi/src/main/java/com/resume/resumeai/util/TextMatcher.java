package com.resume.resumeai.util;

public class TextMatcher {
    public static double score(String a, String b) {
        if (a == null || b == null) return 0.0;
        String[] aa = a.split("\\s+");
        String[] bb = b.split("\\s+");
        int match = 0;
        for (String x : aa) for (String y : bb) if (x.equalsIgnoreCase(y)) match++;
        return match / (double) Math.max(aa.length, bb.length);
    }
}