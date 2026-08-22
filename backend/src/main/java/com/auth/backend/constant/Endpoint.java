package com.auth.backend.constant;

public final class Endpoint {
    private Endpoint() {}

    // Base API Prefixes
    public static final String AUTH = "/api/v1/auth";
    public static final String ADMIN = "/api/v1/admin";
    public static final String PROFILE = "/api/v1/profile";

    // Sub-resource paths (relative)
    public static final String USERS = "/users";
    public static final String USER = "/user";

    public static final String REGISTER = "/register";
    public static final String LOGIN = "/login";
    public static final String REFRESH = "/refresh";
    public static final String LOGOUT = "/logout";
    public static final String FORGOT_PASSWORD = "/forgot-password";
    public static final String RESET_PASSWORD = "/reset-password";
    public static final String VERIFY_EMAIL = "/verify-email";
}