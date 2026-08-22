// UploadAvatar.java
package com.auth.backend.dto.auth;

import com.auth.backend.constant.ResponseMessage;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

public record UploadAvatar(
        @NotNull(message = ResponseMessage.FILE_REQUIRED)
        MultipartFile avatar
) {}