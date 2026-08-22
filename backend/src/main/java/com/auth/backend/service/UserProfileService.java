package com.auth.backend.service;

import com.auth.backend.constant.ResponseMessage;
import com.auth.backend.dto.user.EditUserRequest;
import com.auth.backend.dto.user.UserResponse;
import com.auth.backend.entity.UserEntity;
import com.auth.backend.exception.CustomNotFoundException;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserProfileService {
    private final UserManagement userManagement;
    private final FileService fileService;

    private String sanitize(String input) {
        return input == null ? null : Jsoup.clean(input, Safelist.none());
    }

    @Transactional
    public String uploadAvatar(UserEntity user, MultipartFile avatar) {
        if (avatar != null && !avatar.isEmpty()) {
            if (user.getAvatar() != null) {
                fileService.removeFile(user.getAvatar());
            }
            String avatarName = fileService.saveFile(avatar);
            user.setAvatar(avatarName);
            userManagement.saveUser(user);
            return avatarName; // Fayl nomini qaytaramiz
        }
        return user.getAvatar();
    }

    @Transactional
    public void removeAvatar(UserEntity user) {
        if (user.getAvatar() != null) {
            fileService.removeFile(user.getAvatar());
            user.setAvatar(null);
            userManagement.saveUser(user);
        }
    }

    @Transactional
    public UserResponse editUser(UserEntity user,EditUserRequest request) {
        Optional.ofNullable(request.firstName()).ifPresent(val -> user.setFirstName(sanitize(val)));
        Optional.ofNullable(request.bio()).ifPresent(val -> user.setBio(sanitize(val)));
        Optional.ofNullable(request.lastName()).ifPresent(user::setLastName);
        Optional.ofNullable(request.username()).ifPresent(user::setUsername);
        Optional.ofNullable(request.birthDate()).ifPresent(user::setBirthDate);
        Optional.ofNullable(request.country()).ifPresent(user::setCountry);
        Optional.ofNullable(request.gender()).ifPresent(user::setGender);
        Optional.ofNullable(request.skills()).ifPresent(user::setSkills);
        Optional.ofNullable(request.socialLinks()).ifPresent(user::setSocialLinks);
        Optional.ofNullable(request.phone()).ifPresent(user::setPhone);

        userManagement.saveUser(user);
        return UserResponse.from(user);
    }

    @Transactional
    public void removeSkills(UserEntity user,String skillName) {
        if (user.getSkills() == null || !user.getSkills().removeIf(skill -> skill.equals(skillName))) {
            throw new CustomNotFoundException(ResponseMessage.NOT_FOUND);
        }
        userManagement.saveUser(user);
    }

    @Transactional
    public void removeSocialLinks(UserEntity user,String social) {
        if (user.getSocialLinks() == null || !user.getSocialLinks().removeIf(s -> s.equals(social))) {
            throw new CustomNotFoundException(ResponseMessage.NOT_FOUND);
        }
        userManagement.saveUser(user);
    }

    @Transactional(readOnly = true)
    public UserResponse me(Long userId) {
        UserEntity user = userManagement.findUserById(userId);
        return UserResponse.from(user);
    }


}