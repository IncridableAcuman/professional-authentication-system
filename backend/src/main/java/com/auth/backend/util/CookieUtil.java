package com.auth.backend.util;

import com.auth.backend.constant.EnvironmentValues;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
@RequiredArgsConstructor
public class CookieUtil {

    private final EnvironmentValues environmentValues;

    private void cookieManagement(String refreshToken, long expirationMillis, HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie
                .from("refreshToken", refreshToken != null ? refreshToken : "")
                .maxAge(Duration.ofMillis(expirationMillis))
                .httpOnly(true)
                .path("/")
                .sameSite("Lax")
                .secure(environmentValues.isCookieSecure())
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public void addCookie(String refreshToken, HttpServletResponse response) {
        cookieManagement(refreshToken, environmentValues.getRefreshTime(), response);
    }

    public void clearCookie(HttpServletResponse response) {
        cookieManagement(null, 0, response);
    }
}