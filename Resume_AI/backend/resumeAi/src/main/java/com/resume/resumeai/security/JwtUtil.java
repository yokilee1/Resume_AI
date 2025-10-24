package com.resume.resumeai.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret:change_me}")
    private String secret;

    @Value("${jwt.access-token-ttl-minutes:30}")
    private long ttlMinutes;

    public String issueToken(Long userId, String email) {
        long now = Instant.now().getEpochSecond();
        long exp = now + ttlMinutes * 60;
        String header = base64Json(Map.of("alg","HS256","typ","JWT"));
        String payload = base64Json(Map.of("sub", String.valueOf(userId), "email", email, "iat", now, "exp", exp));
        String signature = hmacSha256(header + "." + payload, secret);
        return header + "." + payload + "." + signature;
    }

    public String refreshToken(String token) {
        Claims c = verify(token);
        if (c == null) throw new IllegalArgumentException("Invalid token");
        return issueToken(Long.valueOf(c.getSubject()), c.getEmail());
    }

    public Claims verify(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return null;
            String data = parts[0] + "." + parts[1];
            String sig = hmacSha256(data, secret);
            if (!sig.equals(parts[2])) return null;
            String json = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
            Map<String, Object> map = Json.minParse(json);
            long exp = ((Number)map.get("exp")).longValue();
            if (Instant.now().getEpochSecond() > exp) return null;
            String sub = (String) map.get("sub");
            String email = (String) map.get("email");
            return new Claims(sub, email);
        } catch (Exception e) {
            return null;
        }
    }

    private String hmacSha256(String data, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] result = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(result);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private String base64Json(Map<String, Object> map) {
        String json = Json.minStringify(map);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(json.getBytes(StandardCharsets.UTF_8));
    }

    public static class Claims {
        private final String subject;
        private final String email;
        public Claims(String subject, String email) { this.subject = subject; this.email = email; }
        public String getSubject() { return subject; }
        public String getEmail() { return email; }
    }

    // Minimal JSON util to avoid extra dependencies
    static class Json {
        static String minStringify(Map<String,Object> map) {
            StringBuilder sb = new StringBuilder("{");
            boolean first = true;
            for (Map.Entry<String,Object> e: map.entrySet()) {
                if (!first) sb.append(",");
                first = false;
                sb.append("\"").append(e.getKey()).append("\":");
                Object v = e.getValue();
                if (v instanceof Number) sb.append(v);
                else sb.append("\"").append(v.toString()).append("\"");
            }
            sb.append("}");
            return sb.toString();
        }
        static Map<String,Object> minParse(String json) {
            // very naive parser for flat objects: for demo only
            java.util.HashMap<String,Object> m = new java.util.HashMap<>();
            String body = json.trim();
            if (body.startsWith("{") && body.endsWith("}")) {
                body = body.substring(1, body.length()-1);
            }
            if (body.isEmpty()) return m;
            String[] parts = body.split(",");
            for (String part : parts) {
                String[] kv = part.split(":");
                String k = kv[0].trim().replaceAll("^\"|\"$", "");
                String raw = kv[1].trim();
                if (raw.matches("^-?\\d+(\\.\\d+)?$")) {
                    m.put(k, Long.parseLong(raw));
                } else {
                    m.put(k, raw.replaceAll("^\"|\"$", ""));
                }
            }
            return m;
        }
    }
}