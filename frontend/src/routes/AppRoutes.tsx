import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { VerifyEmailPage } from "../features/auth/pages/VerifyEmailPage";
import { ForgotPasswordPage } from "../features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../features/auth/pages/ResetPasswordPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { ProfilePage } from "../features/profile/pages/ProfilePage";
import { AdminRoute } from "./AdminRoute";
import { AdminDashboard } from "../features/admin/pages/AdminDashboard";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Ochiq marshrutlar (Mehmonlar uchun) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Himoyalangan marshrutlar (Faqat tizimga kirganlar uchun) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Faqat Adminlar uchun */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>

      {/* Noto'g'ri URL yozilsa avtomat yo'naltirish */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};