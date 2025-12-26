import { z } from 'zod';

// Register schema
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required').max(100),
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

// Refresh token schema
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

// Reset password request schema
export const resetPasswordRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Confirm reset password schema
export const confirmResetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Update profile schema
export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatar: z.string().optional(),
  settings: z
    .object({
      language: z.enum(['en', 'zh']).optional(),
      theme: z.enum(['light', 'dark', 'system']).optional(),
      defaultModel: z.string().optional(),
      emailNotifications: z.boolean().optional(),
    })
    .optional(),
});

// Verify email schema
export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

// Types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ResetPasswordRequestInput = z.infer<typeof resetPasswordRequestSchema>;
export type ConfirmResetPasswordInput = z.infer<typeof confirmResetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
