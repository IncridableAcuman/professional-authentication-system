package com.auth.backend.util;

import com.auth.backend.constant.EnvironmentValues;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CookieUtil {
    private final EnvironmentValues environmentValues;

    private static  void cookieManagement(String refreshToken,long expiration, HttpServletResponse response){
        Cookie cookie = new Cookie("refreshToken",refreshToken);
        cookie.setValue(refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge((int) expiration);

        response.addCookie(cookie);
    }
    public void addCookie(String refreshToken,HttpServletResponse response){
        cookieManagement(refreshToken,environmentValues.getRefreshTime(),response);
    }
    public void clearCookie(HttpServletResponse response){
        cookieManagement(null,0,response);
    }
}
