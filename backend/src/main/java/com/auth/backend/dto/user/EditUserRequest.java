package com.auth.backend.dto.user;

import com.auth.backend.constant.ResponseMessage;
import com.auth.backend.entity.enums.Gender;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

public record EditUserRequest(
        @Size(min = 3, max = 50, message = ResponseMessage.FIRST_NAME_REQUIRED_LENGTH)
        String firstName,

        @Size(min = 3, max = 50, message = ResponseMessage.LAST_NAME_REQUIRED_LENGTH)
        String lastName,

        @Size(min = 3, max = 50, message = ResponseMessage.USER_NAME_REQUIRED_LENGTH)
        String username,

        Gender gender,
        LocalDate birthDate, // Date o'rniga LocalDate
        String phone,

        @Size(max = 500, message = ResponseMessage.BIO_MAX_LENGTH)
        String bio,

        String country,
        List<String> skills,
        List<String> socialLinks
) {}