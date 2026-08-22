package com.auth.backend.service;

import com.auth.backend.dto.user.RoleRequest;
import com.auth.backend.dto.user.UserResponse;
import com.auth.backend.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminClientService {
    private final UserManagement userManagement;
    private final TokenService tokenService;

    // Barcha foydalanuvchilarni olish
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userManagement.findAllUsers() // userRepository.findAll() ni chaqiradi
                .stream()
                .map(UserResponse::from)
                .toList();
    }

    @Transactional
    public void editRole(Long id, RoleRequest request){
        UserEntity user = userManagement.findUserById(id);
        user.setRole(request.role());
        userManagement.saveUser(user);
    }

    @Transactional
    public void removeUser(Long id){
        UserEntity user = userManagement.findUserById(id);
        tokenService.removeToken(user);
        userManagement.deleteUser(user);
    }
    public List<UserResponse> getAllUsers() {
    return userManagement.findAll(); // findAllUsers() o'rniga findAll()
}
}