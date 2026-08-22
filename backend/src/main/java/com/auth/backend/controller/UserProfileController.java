package com.auth.backend.controller;

import com.auth.backend.constant.Endpoint;
import com.auth.backend.constant.ResponseMessage;
import com.auth.backend.dto.user.EditUserRequest;
import com.auth.backend.dto.user.UserResponse;
import com.auth.backend.entity.UserEntity;
import com.auth.backend.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(Endpoint.PROFILE)
@RequiredArgsConstructor
public class UserProfileController {
    private final UserProfileService userProfileService;


    @PatchMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadAvatar(
            @AuthenticationPrincipal UserEntity user,
            @RequestPart("avatar") MultipartFile avatar) {
        String avatarName = userProfileService.uploadAvatar(user, avatar);
        return ResponseEntity.ok(avatarName);
    }

    @DeleteMapping("/avatar")
    public ResponseEntity<String> removeAvatar(@AuthenticationPrincipal UserEntity user) {
        userProfileService.removeAvatar(user);
        return ResponseEntity.ok(ResponseMessage.SUCCESS);
    }

    @PatchMapping("/edit")
    public ResponseEntity<UserResponse> editUser(@AuthenticationPrincipal UserEntity user,@Valid @RequestBody EditUserRequest request) {
        return ResponseEntity.ok(userProfileService.editUser(user,request));
    }

    @DeleteMapping("/skills/{skillName}")
    public ResponseEntity<String> removeSkills(@AuthenticationPrincipal UserEntity user,@PathVariable String skillName) {
        userProfileService.removeSkills(user,skillName);
        return ResponseEntity.ok(ResponseMessage.SUCCESS);
    }

    @DeleteMapping("/socials/{social}")
    public ResponseEntity<String> removeSocialLink(@AuthenticationPrincipal UserEntity user,@PathVariable String social) {
        userProfileService.removeSocialLinks(user,social);
        return ResponseEntity.ok(ResponseMessage.SUCCESS);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@AuthenticationPrincipal UserEntity user) {
        return ResponseEntity.ok(userProfileService.me(user.getId()));
    }
}