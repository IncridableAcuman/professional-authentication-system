package com.auth.backend.service;

import com.auth.backend.constant.ResponseMessage;
import com.auth.backend.dto.user.UserResponse;
import com.auth.backend.entity.UserEntity;
import com.auth.backend.exception.CustomBadRequestException;
import com.auth.backend.exception.CustomNotFoundException;
import com.auth.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserManagement {
    private final UserRepository userRepository;

    public UserEntity findUserById(Long id){
        return userRepository.findById(id).orElseThrow(()-> new CustomNotFoundException(ResponseMessage.NOT_FOUND));
    }

    public UserEntity findUserByEmail(String email){
        return userRepository.findByEmail(email).orElseThrow(()-> new CustomNotFoundException(ResponseMessage.NOT_FOUND));
    }
    @Transactional
    public void deleteUser(UserEntity user){
        userRepository.delete(user);
    }

    @Transactional
    public void saveUser(UserEntity user){
        userRepository.save(user);
    }

    public void isExistUser(String email){
        if (userRepository.findByEmail(email).isPresent()){
            throw new CustomBadRequestException(ResponseMessage.EXIST_USER);
        }
    }
    public UserEntity findByEmailOrUsername(String email,String username){
        return userRepository.findByEmailOrUsername(email,username).orElseThrow(()-> new UsernameNotFoundException(ResponseMessage.NOT_FOUND));
    }
    public List<UserResponse> findAll(){
        List<UserEntity> users = userRepository.findAll();
        return users
                .stream()
                .map(UserResponse::from).toList();
    }
}
