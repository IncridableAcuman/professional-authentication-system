package com.auth.backend.constant;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public final class EnvironmentValues {
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.access_time}")
    private long accessTime;

    @Value("${jwt.refresh_time}")
    private long refreshTime;

    @Value("${client.url}")
    private String clientUrl;

    @Value("${file.upload.dir}")
    private String uploadDir;

    @Value("${otp.time}")
    private int otpTime;

    @Value("${cookie.secure}")
    private boolean cookieSecure;
}