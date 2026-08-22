package com.auth.backend.dto.error;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

public record ErrorResponse(
        int status,
        String error,
        String message,
        String path,

        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime timestamp
) {
    // 1. Exception obyekti orqali yaratish
    public static ErrorResponse from(Exception exception, HttpStatus status, HttpServletRequest request) {
        String message = exception.getMessage() != null ? exception.getMessage() : status.getReasonPhrase();
        return from(message, status, request);
    }

    // 2. Tayyor String xabar orqali yaratish (Overload)
    public static ErrorResponse from(String message, HttpStatus status, HttpServletRequest request) {
        return new ErrorResponse(
                status.value(),
                status.getReasonPhrase(),
                message,
                request.getRequestURI(),
                LocalDateTime.now()
        );
    }
}