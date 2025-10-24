package com.resume.resumeai.service;

import com.resume.resumeai.domain.User;
import com.resume.resumeai.domain.dto.LoginRequest;
import com.resume.resumeai.domain.dto.RegisterRequest;
import com.resume.resumeai.repository.UserRepository;
import com.resume.resumeai.security.JwtUtil;
import com.resume.resumeai.util.PasswordUtil;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public Map<String, Object> register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        User u = new User();
        u.setEmail(req.getEmail());
        u.setPasswordHash(PasswordUtil.hash(req.getPassword()));
        u.setNickname(req.getNickname());
        userRepository.create(u);
        String token = jwtUtil.issueToken(u.getId(), u.getEmail());
        return Map.of("token", token, "userId", u.getId());
    }

    public Map<String, Object> login(LoginRequest req) {
        User u = userRepository.findByEmail(req.getEmail());
        if (u == null || !PasswordUtil.verify(req.getPassword(), u.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        String token = jwtUtil.issueToken(u.getId(), u.getEmail());
        return Map.of("token", token, "userId", u.getId());
    }

    public Map<String, Object> refresh(String authorization) {
        String token = authorization != null && authorization.startsWith("Bearer ") ? authorization.substring(7) : null;
        String newToken = jwtUtil.refreshToken(token);
        return Map.of("token", newToken);
    }
}