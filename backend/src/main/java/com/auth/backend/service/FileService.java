package com.auth.backend.service;

import com.auth.backend.constant.EnvironmentValues;
import com.auth.backend.exception.CustomInternalServerErrorException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {
    @Value("${file.upload.dir}")
    private String uploadDir;

    public String  saveFile(MultipartFile file){
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)){
                Files.createDirectories(uploadPath);
            }
            String originalName = file.getOriginalFilename();
            String extension=".";
            if (originalName != null && originalName.contains(extension)){
                extension=originalName.substring(originalName.indexOf("."));
            }
            String fileName = UUID.randomUUID() + extension;
            Path path = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(),path, StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException exception){
            throw new CustomInternalServerErrorException(exception.getMessage());
        }
    }
    public void removeFile(String avatar){
        try {
            Path filePath = Paths.get(uploadDir,avatar);
            Files.deleteIfExists(filePath);
        } catch (IOException exception){
            throw new CustomInternalServerErrorException(exception.getMessage());
        }
    }
}
