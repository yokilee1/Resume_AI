package com.resume.resumeai.service;

import com.resume.resumeai.domain.User;
import com.resume.resumeai.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) { this.userRepository = userRepository; }

    public User getCurrentUser() {
        // TODO: 从安全上下文获取用户ID
        Long userId = 1L;
        return userRepository.findById(userId);
    }

    public User updateCurrentUser(User patch) {
        Long userId = 1L;
        patch.setId(userId);
        userRepository.updateProfile(patch);
        return userRepository.findById(userId);
    }
}