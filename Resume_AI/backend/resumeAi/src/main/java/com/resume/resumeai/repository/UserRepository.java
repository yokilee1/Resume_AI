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
            INSERT INTO users(email, password, username, type, created_at)
            VALUES(:email, :password, :username, :type, NOW())
        """;
        Map<String, Object> p = new HashMap<>();
        p.put("email", u.getEmail());
        p.put("password", u.getPasswordHash());
        p.put("username", u.getNickname());
        p.put("type", 0);
        jdbc.update(sql, p);
        u.setId(findIdByEmail(u.getEmail()));
    }

    public Long findIdByEmail(String email) {
        return jdbc.queryForObject("SELECT user_id FROM users WHERE email=:email", Map.of("email", email), Long.class);
    }

    public User findByEmail(String email) {
        List<User> list = jdbc.query("SELECT user_id, email, password, username FROM users WHERE email=:email",
                Map.of("email", email),
                (rs, i) -> {
                    User u = new User();
                    u.setId(rs.getLong("user_id"));
                    u.setEmail(rs.getString("email"));
                    u.setPasswordHash(rs.getString("password"));
                    u.setNickname(rs.getString("username"));
                    return u;
                });
        return list.isEmpty() ? null : list.get(0);
    }

    public User findById(Long id) {
        List<User> list = jdbc.query("SELECT user_id, email, password, username, role, status, created_at FROM users WHERE user_id=:id",
                Map.of("id", id),
                (rs, i) -> {
                    User u = new User();
                    u.setId(rs.getLong("user_id"));
                    u.setEmail(rs.getString("email"));
                    u.setPasswordHash(rs.getString("password"));
                    u.setNickname(rs.getString("username"));
                    u.setRole(rs.getString("role"));
                    u.setStatus(rs.getString("status"));
                    u.setJoinedAt(rs.getString("created_at"));
                    return u;
                });
        return list.isEmpty() ? null : list.get(0);
    }

    public void updateProfile(User patch) {
        String sql = "UPDATE users SET username=:username WHERE user_id=:id";
        jdbc.update(sql, Map.of("username", patch.getNickname(), "id", patch.getId()));
    }

    public List<User> findAll(int page, int pageSize) {
        int offset = (page - 1) * pageSize;
        String sql = """
            SELECT user_id, email, password, username, role, status, created_at
            FROM users
            ORDER BY user_id DESC
            LIMIT :limit OFFSET :offset
        """;
        return jdbc.query(sql, Map.of("limit", pageSize, "offset", offset), (rs, i) -> {
            User u = new User();
            u.setId(rs.getLong("user_id"));
            u.setEmail(rs.getString("email"));
            u.setPasswordHash(rs.getString("password"));
            u.setNickname(rs.getString("username"));
            u.setRole(rs.getString("role"));
            u.setStatus(rs.getString("status"));
            u.setJoinedAt(rs.getString("created_at"));
            return u;
        });
    }

    public int count() {
        Integer c = jdbc.queryForObject("SELECT COUNT(1) FROM users", Map.of(), Integer.class);
        return c == null ? 0 : c;
    }

    public void updateRole(Long userId, String role) {
        jdbc.update("UPDATE users SET role=:role WHERE user_id=:id", Map.of("role", role, "id", userId));
    }

    public void updateStatus(Long userId, String status) {
        jdbc.update("UPDATE users SET status=:status WHERE user_id=:id", Map.of("status", status, "id", userId));
    }

    public void deleteById(Long id) {
        jdbc.update("DELETE FROM users WHERE user_id=:id", Map.of("id", id));
    }
}