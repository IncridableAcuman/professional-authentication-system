package com.auth.backend.controller;

import com.auth.backend.constant.Endpoint;
import com.auth.backend.constant.ResponseMessage;
import com.auth.backend.dto.user.EditUserRequest;
import com.auth.backend.dto.user.UserResponse;
import com.auth.backend.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
public class UserProfileController {
    private final UserProfileService userProfileService;

    @PatchMapping("/{id}/avatar")
    public ResponseEntity<String> uploadAvatar(@PathVariable Long id, @ModelAttribute MultipartFile avatar){
        userProfileService.uploadAvatar(id,avatar);
        return ResponseEntity.ok(ResponseMessage.SUCCESS);
    }
    @PostMapping("/{id}/avatar/remove")
    public ResponseEntity<String> removeAvatar(@PathVariable Long id){
        userProfileService.removeAvatar(id);
        return ResponseEntity.ok(ResponseMessage.SUCCESS);
    }
    @PatchMapping("/{id}/edit")
    public ResponseEntity<UserResponse> editUser(@PathVariable Long id, @RequestBody EditUserRequest request){
        return ResponseEntity.ok(userProfileService.editUser(id,request));
    }
    @DeleteMapping("/{id}/skills/{skillName}")
    public ResponseEntity<String> removeSkills(@PathVariable Long id,@PathVariable String skillName){
        userProfileService.removeSkills(id,skillName);
        return ResponseEntity.ok(ResponseMessage.SUCCESS);
    }
    @DeleteMapping("/{id}/socials/{social}")
    public ResponseEntity<String> removeSocialLink(@PathVariable Long id,@PathVariable String social){
        userProfileService.removeSocialLinks(id,social);
        return ResponseEntity.ok(ResponseMessage.SUCCESS);
    }
    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(){
        return ResponseEntity.ok(userProfileService.me());
    }
}
