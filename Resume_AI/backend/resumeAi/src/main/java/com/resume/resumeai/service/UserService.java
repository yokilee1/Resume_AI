package com.resume.resumeai.service;

import com.resume.resumeai.domain.User;
import com.resume.resumeai.repository.UserRepository;
import com.resume.resumeai.security.SecurityUtil;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) { this.userRepository = userRepository; }

    public User getCurrentUser() {
        Long userId = SecurityUtil.getCurrentUserIdOrThrow();
        return userRepository.findById(userId);
    }

    public User updateCurrentUser(User patch) {
        Long userId = SecurityUtil.getCurrentUserIdOrThrow();
        patch.setId(userId);
        userRepository.updateProfile(patch);
        return userRepository.findById(userId);
    }
}