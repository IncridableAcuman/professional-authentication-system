package com.auth.backend.dto.user;

import com.auth.backend.entity.UserEntity;
import com.auth.backend.entity.enums.Gender;
import com.auth.backend.entity.enums.UserRole;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record UserResponse(
        Long id,
        String firstName,
        String lastName,
        String username,
        String email,
        UserRole role,
        Gender gender,
        String phone,
        boolean enabled,
        String avatar,
        LocalDate birthDate,
        String bio,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        String country,
        List<String> skills,
        List<String> socialLinks
) {
    public static UserResponse from(UserEntity user) {
        if (user == null) return null;
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getGender(),
                user.getPhone(),
                user.isEnabled(),
                user.getAvatar(),
                user.getBirthDate(),
                user.getBio(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                user.getCountry(),
                user.getSkills(),
                user.getSocialLinks()
        );
    }
}