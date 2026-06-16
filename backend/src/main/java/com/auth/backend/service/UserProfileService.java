package com.auth.backend.service;

import com.auth.backend.constant.ResponseMessage;
import com.auth.backend.dto.user.EditUserRequest;
import com.auth.backend.dto.user.UserResponse;
import com.auth.backend.entity.UserEntity;
import com.auth.backend.exception.CustomNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserProfileService {
    private final UserManagement userManagement;
    private final FileService fileService;

    public void uploadAvatar(Long id, MultipartFile avatar){
        UserEntity user = userManagement.findUserById(id);
        String avatarName=null;
        if (avatar != null){
            avatarName = fileService.saveFile(avatar);
        }
        Optional.ofNullable(avatarName).ifPresent(user::setAvatar);
        userManagement.saveUser(user);
    }

    public void removeAvatar(Long id){
        UserEntity user = userManagement.findUserById(id);
        fileService.removeFile(user.getAvatar());
        user.setAvatar(null);
        userManagement.saveUser(user);
    }

    public UserResponse editUser(Long id, EditUserRequest request){
        UserEntity user = userManagement.findUserById(id);
        Optional.ofNullable(request.getFirstName()).ifPresent(user::setFirstName);
        Optional.ofNullable(request.getLastName()).ifPresent(user::setLastName);
        Optional.ofNullable(request.getUsername()).ifPresent(user::setUsername);
        Optional.ofNullable(request.getBirthDate()).ifPresent(user::setBirthDate);
        Optional.ofNullable(request.getBio()).ifPresent(user::setBio);
        Optional.ofNullable(request.getCountry()).ifPresent(user::setCountry);
        Optional.ofNullable(request.getGender()).ifPresent(user::setGender);
        Optional.ofNullable(request.getSkills()).ifPresent(user::setSkills);
        Optional.ofNullable(request.getSocialLinks()).ifPresent(user::setSocialLinks);
        Optional.ofNullable(request.getPhone()).ifPresent(user::setPhone);

        userManagement.saveUser(user);

        return UserResponse.from(user);
    }
    @Transactional
    public void removeSkills(Long id,String skillName){
        UserEntity user = userManagement.findUserById(id);
        boolean isRemoved = user.getSkills()
                .removeIf(skill-> skill.equals(skillName));

        if (!isRemoved){
            throw new CustomNotFoundException(ResponseMessage.NOT_FOUND);
        }
        userManagement.saveUser(user);
    }
    @Transactional
    public void removeSocialLinks(Long id,String social){
        UserEntity user = userManagement.findUserById(id);
        boolean isRemoved = user.getSocialLinks().removeIf(s->s.equals(social));
        if (!isRemoved){
            throw new CustomNotFoundException(ResponseMessage.NOT_FOUND);
        }
        userManagement.saveUser(user);
    }



}
