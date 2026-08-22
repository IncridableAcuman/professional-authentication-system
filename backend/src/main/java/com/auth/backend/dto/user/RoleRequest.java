package com.auth.backend.dto.user;

import com.auth.backend.constant.ResponseMessage;
import com.auth.backend.entity.enums.UserRole;
import jakarta.validation.constraints.NotNull;

public record RoleRequest(
        @NotNull(message = ResponseMessage.GENDER_REQUIRED) // maxsus xabar berish mumkin
        UserRole role
) {}