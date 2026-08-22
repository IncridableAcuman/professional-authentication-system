package com.auth.backend.exception;

import com.auth.backend.dto.error.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Custom UnAuthorized (401)
    @ExceptionHandler(CustomUnauthorizedException.class)
    public ResponseEntity<ErrorResponse> customUnauthorizedExceptionHandler(CustomUnauthorizedException exception, HttpServletRequest request) {
        log.warn("Unauthorized access: {} - Path: {}", exception.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ErrorResponse.from(exception, HttpStatus.UNAUTHORIZED, request));
    }

    // 2. Custom NotFound (404)
    @ExceptionHandler(CustomNotFoundException.class)
    public ResponseEntity<ErrorResponse> customNotFoundExceptionHandler(CustomNotFoundException exception, HttpServletRequest request) {
        log.warn("Resource not found: {} - Path: {}", exception.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ErrorResponse.from(exception, HttpStatus.NOT_FOUND, request));
    }

    // 3. Custom BadRequest (400)
    @ExceptionHandler(CustomBadRequestException.class)
    public ResponseEntity<ErrorResponse> customBadRequestExceptionHandler(CustomBadRequestException exception, HttpServletRequest request) {
        log.warn("Bad request: {} - Path: {}", exception.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.from(exception, HttpStatus.BAD_REQUEST, request));
    }

    // 4. Custom Internal Server Error (500)
    @ExceptionHandler(CustomInternalServerErrorException.class)
    public ResponseEntity<ErrorResponse> customInternalServerErrorExceptionHandler(CustomInternalServerErrorException exception, HttpServletRequest request) {
        log.error("Internal server error: ", exception);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.from(exception, HttpStatus.INTERNAL_SERVER_ERROR, request));
    }

    // 5. DTO Validatsiya xatolarini ushlash (@Valid buzilganda)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException exception, HttpServletRequest request) {
        String errorMessage = exception.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        log.warn("Validation failed: {} - Path: {}", errorMessage, request.getRequestURI());

        CustomBadRequestException ex = new CustomBadRequestException(errorMessage);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.from(ex, HttpStatus.BAD_REQUEST, request));
    }

    // 6. JSON shakli buzulgan bo'lsa (Malformed JSON)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException exception, HttpServletRequest request) {
        log.warn("Malformed JSON request - Path: {}", request.getRequestURI());
        CustomBadRequestException ex = new CustomBadRequestException("So'rov formati (JSON) noto'g'ri shakllantirilgan");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.from(ex, HttpStatus.BAD_REQUEST, request));
    }

    // 7. Yuklanayotgan fayl hajmi kattaligi
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleMaxUploadSizeExceeded(MaxUploadSizeExceededException exception, HttpServletRequest request) {
        log.warn("File size limit exceeded - Path: {}", request.getRequestURI());
        CustomBadRequestException ex = new CustomBadRequestException("Yuklanayotgan fayl hajmi ruxsat etilgan limitdan katta");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.from(ex, HttpStatus.BAD_REQUEST, request));
    }

    // 8. Barcha kutilmagan tizim xatolarini ushlash (Catch-all)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception exception, HttpServletRequest request) {
        log.error("Unhandled exception occurred: ", exception);
        CustomInternalServerErrorException ex = new CustomInternalServerErrorException("Kutilmagan server xatoligi yuz berdi");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.from(ex, HttpStatus.INTERNAL_SERVER_ERROR, request));
    }
}