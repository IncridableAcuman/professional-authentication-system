package com.auth.backend.service;

import com.auth.backend.constant.EnvironmentValues;
import com.auth.backend.constant.ResponseMessage;
import com.auth.backend.dto.auth.*;
import com.auth.backend.entity.UserEntity;
import com.auth.backend.entity.enums.UserRole;
import com.auth.backend.exception.CustomBadRequestException;
import com.auth.backend.exception.CustomUnauthorizedException;
import com.auth.backend.producer.RabbitMQProducer;
import com.auth.backend.util.CookieUtil;
import com.auth.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtUtil jwtUtil;
    private final CookieUtil cookieUtil;
    private final PasswordEncoder passwordEncoder;
    private final RabbitMQProducer rabbitMQProducer;
    private final TokenService tokenService;
    private final EnvironmentValues environmentValues;
    private final UserManagement userManagement;

    public void register(RegisterRequest request){
        userManagement.isExistUser(request.getEmail());
        UserEntity user = new UserEntity();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.USER);
        userManagement.saveUser(user);

        sendToMail(user);

    }
    public AuthResponse login(LoginRequest request,HttpServletResponse response){
        UserEntity user = userManagement.findUserByEmail(request.getEmail());
        if (!user.isEnabled()){
            throw new CustomBadRequestException(ResponseMessage.NOT_VERIFIED);
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new CustomBadRequestException(ResponseMessage.MISMATCH_PASSWORD);
        }
        return authResponse(user,response);
    }
    public AuthResponse refresh(String refreshToken,HttpServletResponse response){
        UserEntity user = jwtUtil.extractUser(refreshToken);
        if (!jwtUtil.validateToken(refreshToken)){
            throw new CustomUnauthorizedException(ResponseMessage.INVALID_TOKEN);
        }
        return authResponse(user,response);
    }
    public void logout(String refreshToken,HttpServletResponse response){
        UserEntity user = jwtUtil.extractUser(refreshToken);
        if (!jwtUtil.validateToken(refreshToken)){
            throw new CustomUnauthorizedException(ResponseMessage.INVALID_TOKEN);
        }
        tokenService.removeToken(user);
        cookieUtil.clearCookie(response);
    }
    public void forgotPassword(ForgotPasswordRequest request){
        UserEntity user = userManagement.findUserByEmail(request.getEmail());
        String token = jwtUtil.generateAccessToken(user);
        String url = environmentValues.getClientUrl() + "/reset-password?token=" + token;

        EmailPayload payload = new EmailPayload(user.getEmail(),"Reset Password",url);
        rabbitMQProducer.sendMessageWithRabbitMQ(payload);
    }
    public void resetPassword(ResetPasswordRequest request){
        if (!request.getPassword().equals(request.getConfirmPassword())){
            throw new CustomBadRequestException(ResponseMessage.MISMATCH_PASSWORD);
        }
        if (!jwtUtil.validateToken(request.getToken())){
            throw new CustomBadRequestException(ResponseMessage.EXPIRED_TOKEN);
        }
        UserEntity user = jwtUtil.extractUser(request.getToken());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userManagement.saveUser(user);
    }

    public void verifyEmail(String token){
        UserEntity user = jwtUtil.extractUser(token);
        if (!jwtUtil.validateToken(token)){
            throw new CustomBadRequestException(ResponseMessage.INVALID_TOKEN);
        }
        user.setEnabled(true);
        userManagement.saveUser(user);
    }



    public  void sendToMail(UserEntity user){
        String token = jwtUtil.generateAccessToken(user);
        String url = environmentValues.getClientUrl() + "/verify-email?token="+token;
        EmailPayload payload = new EmailPayload(user.getEmail(),"Verify Email",url);
        rabbitMQProducer.sendMessageWithRabbitMQ(payload);
    }

    public AuthResponse authResponse(UserEntity user,HttpServletResponse response){
        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        tokenService.saveToken(user,refreshToken);

        cookieUtil.addCookie(refreshToken,response);

        return AuthResponse.from(accessToken);
    }

}
