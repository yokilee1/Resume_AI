package com.resume.resumeai.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class TextMatcherTest {

    @Test
    @DisplayName("score: 相同字符串应返回 1.0")
    void score_identical() {
        assertThat(TextMatcher.score("Java Spring", "Java Spring")).isEqualTo(1.0);
    }

    @Test
    @DisplayName("score: 部分匹配应返回正确比例")
    void score_partial() {
        // a: "Java", aa.len=1
        // b: "Java Spring", bb.len=2
        // match=1, score = 1 / 2 = 0.5
        assertThat(TextMatcher.score("Java", "Java Spring")).isEqualTo(0.5);
    }

    @Test
    @DisplayName("score: 处理 null 输入")
    void score_null() {
        assertThat(TextMatcher.score(null, "Java")).isEqualTo(0.0);
        assertThat(TextMatcher.score("Java", null)).isEqualTo(0.0);
    }

    @Test
    @DisplayName("score: 忽略大小写")
    void score_ignore_case() {
        assertThat(TextMatcher.score("JAVA", "java")).isEqualTo(1.0);
    }
}
