// RegisterRequest.java
package com.auth.backend.dto.auth;

import com.auth.backend.constant.ResponseMessage;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = ResponseMessage.USER_NAME_REQUIRED)
        @Size(min = 3, max = 50, message = ResponseMessage.USER_NAME_REQUIRED_LENGTH)
        String username,

        @NotBlank(message = ResponseMessage.EMAIL_REQUIRED)
        @Email(message = ResponseMessage.INVALID_EMAIL)
        String email,

        @NotBlank(message = ResponseMessage.PASSWORD_REQUIRED)
        @Size(min = 8, max = 50, message = ResponseMessage.PASSWORD_REQUIRED_LENGTH)
        String password
) {}