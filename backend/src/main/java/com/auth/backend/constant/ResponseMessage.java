package com.auth.backend.constant;

public final class ResponseMessage {
    private ResponseMessage() {}

    public static final String SUCCESS = "success";
    public static final String NOT_FOUND = "not found";
    public static final String SERVER_ERROR = "internal server error";
    public static final String UNAUTHORIZED = "unauthorized";
    public static final String INVALID_EMAIL = "invalid email format";
    public static final String EMAIL_REQUIRED = "email is required";
    public static final String INVALID_TOKEN = "invalid token";
    public static final String EXPIRED_TOKEN = "token is expired";
    public static final String TOKEN_REQUIRED = "token is required";
    public static final String FIRST_NAME_REQUIRED = "firstname is required";
    public static final String LAST_NAME_REQUIRED = "lastname is required";
    public static final String USER_NAME_REQUIRED = "username is required";
    public static final String PASSWORD_REQUIRED = "password is required";
    public static final String CONFIRM_PASSWORD_REQUIRED = "confirm password is required";
    public static final String GENDER_REQUIRED = "gender is required";
    public static final String FIRST_NAME_REQUIRED_LENGTH = "firstname must be between 3 and 50 characters long";
    public static final String LAST_NAME_REQUIRED_LENGTH = "lastname must be between 3 and 50 characters long";
    public static final String USER_NAME_REQUIRED_LENGTH = "username must be between 3 and 50 characters long";
    public static final String PASSWORD_REQUIRED_LENGTH = "password must be between 8 and 50 characters long";
    public static final String BIO_MAX_LENGTH = "bio must be less than 500 characters";
    public static final String CONFIRM_PASSWORD_REQUIRED_LENGTH = "confirm password must be between 8 and 50 characters long";
    public static final String EXIST_USER = "user already exists";
    public static final String MISMATCH_PASSWORD = "passwords do not match";
    public static final String VERIFIED_USER = "already verified";
    public static final String NOT_VERIFIED = "not verified";
    public static final String INVALID_OTP = "invalid otp";
    public static final String FILE_REQUIRED = "file is required";
    public static final String NULL_EMAIL="email is null";
}