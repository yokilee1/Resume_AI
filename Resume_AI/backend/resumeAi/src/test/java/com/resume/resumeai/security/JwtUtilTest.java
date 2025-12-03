package com.resume.resumeai.security;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = JwtUtil.class)
@TestPropertySource(properties = {
        "jwt.secret=test_secret",
        "jwt.access-token-ttl-minutes=30"
})
class JwtUtilTest {

    @Autowired
    private JwtUtil jwtUtil;

    @Test
    void issue_and_verify_token_success() {
        String token = jwtUtil.issueToken(123L, "user@example.com");
        assertNotNull(token);
        JwtUtil.Claims claims = jwtUtil.verify(token);
        assertNotNull(claims);
        assertEquals("123", claims.getSubject());
        assertEquals("user@example.com", claims.getEmail());
    }

    @Test
    void verify_invalid_signature_returns_null() {
        String token = jwtUtil.issueToken(1L, "a@b.com");
        // Corrupt the signature part
        String tampered = token.substring(0, token.length()-2) + "__";
        assertNull(jwtUtil.verify(tampered));
    }
}