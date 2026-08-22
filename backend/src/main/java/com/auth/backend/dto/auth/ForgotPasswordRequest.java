// ForgotPasswordRequest.java
package com.auth.backend.dto.auth;

import com.auth.backend.constant.ResponseMessage;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequest(
        @NotBlank(message = ResponseMessage.EMAIL_REQUIRED)
        @Email(message = ResponseMessage.INVALID_EMAIL)
        String email
) {}