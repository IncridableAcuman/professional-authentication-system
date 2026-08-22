package com.auth.backend.controller;

import com.auth.backend.constant.Endpoint;
import com.auth.backend.constant.ResponseMessage;
import com.auth.backend.dto.user.EditUserRequest;
import com.auth.backend.dto.user.UserResponse;
import com.auth.backend.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(Endpoint.PROFILE)
@RequiredArgsConstructor
public class UserProfileController {
    private final UserProfileService userProfileService;

    @PatchMapping("/avatar")
    public ResponseEntity<String> uploadAvatar(@RequestParam("avatar") MultipartFile avatar) {
        userProfileService.uploadAvatar(avatar);
        return ResponseEntity.ok(ResponseMessage.SUCCESS);
    }

    @DeleteMapping("/avatar")
    public ResponseEntity<String> removeAvatar() {
        userProfileService.removeAvatar();
        return ResponseEntity.ok(ResponseMessage.SUCCESS);
    }

    @PatchMapping("/edit")
    public ResponseEntity<UserResponse> editUser(@Valid @RequestBody EditUserRequest request) {
        return ResponseEntity.ok(userProfileService.editUser(request));
    }

    @DeleteMapping("/skills/{skillName}")
    public ResponseEntity<String> removeSkills(@PathVariable String skillName) {
        userProfileService.removeSkills(skillName);
        return ResponseEntity.ok(ResponseMessage.SUCCESS);
    }

    @DeleteMapping("/socials/{social}")
    public ResponseEntity<String> removeSocialLink(@PathVariable String social) {
        userProfileService.removeSocialLinks(social);
        return ResponseEntity.ok(ResponseMessage.SUCCESS);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me() {
        return ResponseEntity.ok(userProfileService.me());
    }
}