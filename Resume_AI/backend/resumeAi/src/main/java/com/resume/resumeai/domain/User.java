package com.resume.resumeai.domain;

public class User {
    private Long id;
    private String email;
    private String passwordHash;
    private String nickname;
    private String role; // 'User' or 'Admin'
    private String status; // 'Active' or 'Inactive'
    private String joinedAt;

    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; } public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; } public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getNickname() { return nickname; } public void setNickname(String nickname) { this.nickname = nickname; }
    public String getRole() { return role; } public void setRole(String role) { this.role = role; }
    public String getStatus() { return status; } public void setStatus(String status) { this.status = status; }
    public String getJoinedAt() { return joinedAt; } public void setJoinedAt(String joinedAt) { this.joinedAt = joinedAt; }
}