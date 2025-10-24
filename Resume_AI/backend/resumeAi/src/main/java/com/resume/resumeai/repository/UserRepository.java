package com.resume.resumeai.repository;

import com.resume.resumeai.domain.User;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class UserRepository {
    private final NamedParameterJdbcTemplate jdbc;
    public UserRepository(NamedParameterJdbcTemplate jdbc) { this.jdbc = jdbc; }

    public boolean existsByEmail(String email) {
        Integer r = jdbc.queryForObject("SELECT COUNT(1) FROM users WHERE email=:email",
                Map.of("email", email), Integer.class);
        return r != null && r > 0;
    }

    public void create(User u) {
        String sql = """
            INSERT INTO users(email, password_hash, nickname, created_at)
            VALUES(:email, :password_hash, :nickname, NOW())
        """;
        Map<String, Object> p = new HashMap<>();
        p.put("email", u.getEmail());
        p.put("password_hash", u.getPasswordHash());
        p.put("nickname", u.getNickname());
        jdbc.update(sql, p);
        // TODO: 查询生成的ID（依赖返回键策略或二次查询）
        u.setId(findIdByEmail(u.getEmail()));
    }

    public Long findIdByEmail(String email) {
        return jdbc.queryForObject("SELECT id FROM users WHERE email=:email", Map.of("email", email), Long.class);
    }

    public User findByEmail(String email) {
        List<User> list = jdbc.query("SELECT id, email, password_hash, nickname FROM users WHERE email=:email",
                Map.of("email", email),
                (rs, i) -> {
                    User u = new User();
                    u.setId(rs.getLong("id"));
                    u.setEmail(rs.getString("email"));
                    u.setPasswordHash(rs.getString("password_hash"));
                    u.setNickname(rs.getString("nickname"));
                    return u;
                });
        return list.isEmpty() ? null : list.get(0);
    }

    public User findById(Long id) {
        List<User> list = jdbc.query("SELECT id, email, password_hash, nickname FROM users WHERE id=:id",
                Map.of("id", id),
                (rs, i) -> {
                    User u = new User();
                    u.setId(rs.getLong("id"));
                    u.setEmail(rs.getString("email"));
                    u.setPasswordHash(rs.getString("password_hash"));
                    u.setNickname(rs.getString("nickname"));
                    return u;
                });
        return list.isEmpty() ? null : list.get(0);
    }

    public void updateProfile(User patch) {
        String sql = "UPDATE users SET nickname=:nickname WHERE id=:id";
        jdbc.update(sql, Map.of("nickname", patch.getNickname(), "id", patch.getId()));
    }
}