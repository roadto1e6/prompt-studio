import { FastifyInstance } from 'fastify';
import prisma from '../../config/database.js';
import { hashPassword, verifyPassword } from '../../utils/hash.js';
import { generateRefreshToken, generateVerificationToken, parseDuration } from '../../utils/token.js';
import config from '../../config/index.js';
import type {
  RegisterInput,
  LoginInput,
  ChangePasswordInput,
  UpdateProfileInput,
  ResetPasswordRequestInput,
  ConfirmResetPasswordInput,
} from './auth.schema.js';

// User response type (without password)
export interface UserResponse {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  emailVerified: boolean;
  settings: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}

// Auth response type
export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Transform user to response (remove password)
function toUserResponse(user: {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  emailVerified: boolean;
  settings: unknown;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}): UserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    emailVerified: user.emailVerified,
    settings: user.settings as Record<string, unknown>,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLoginAt: user.lastLoginAt,
  };
}

export class AuthService {
  constructor(private fastify: FastifyInstance) {}

  // Register new user
  async register(input: RegisterInput): Promise<AuthResponse> {
    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await hashPassword(input.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        name: input.name,
      },
    });

    // Generate tokens
    return this.generateAuthResponse(user);
  }

  // Login user
  async login(input: LoginInput): Promise<AuthResponse> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user || !user.password) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValid = await verifyPassword(input.password, user.password);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    return this.generateAuthResponse(user);
  }

  // Logout - invalidate refresh token
  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      // Delete specific refresh token
      await prisma.refreshToken.deleteMany({
        where: {
          userId,
          token: refreshToken,
        },
      });
    } else {
      // Delete all refresh tokens for user
      await prisma.refreshToken.deleteMany({
        where: { userId },
      });
    }
  }

  // Refresh access token
  async refreshToken(token: string): Promise<AuthResponse> {
    // Find refresh token
    const refreshTokenRecord = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!refreshTokenRecord) {
      throw new Error('Invalid refresh token');
    }

    // Check if expired
    if (refreshTokenRecord.expiresAt < new Date()) {
      // Delete expired token
      await prisma.refreshToken.delete({
        where: { id: refreshTokenRecord.id },
      });
      throw new Error('Refresh token expired');
    }

    // Delete old token (rotation)
    await prisma.refreshToken.delete({
      where: { id: refreshTokenRecord.id },
    });

    // Generate new tokens
    return this.generateAuthResponse(refreshTokenRecord.user);
  }

  // Get current user
  async getCurrentUser(userId: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return toUserResponse(user);
  }

  // Update profile
  async updateProfile(userId: string, input: UpdateProfileInput): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Merge settings if provided
    let newSettings = (user.settings || {}) as Record<string, unknown>;
    if (input.settings) {
      newSettings = { ...newSettings, ...input.settings };
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name: input.name ?? user.name,
        avatar: input.avatar ?? user.avatar,
        settings: JSON.parse(JSON.stringify(newSettings)),
      },
    });

    return toUserResponse(updated);
  }

  // Change password
  async changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      throw new Error('User not found or no password set');
    }

    // Verify current password
    const isValid = await verifyPassword(input.currentPassword, user.password);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await hashPassword(input.newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Invalidate all refresh tokens
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  // OAuth login/register
  async oauthLogin(
    provider: 'google' | 'github',
    profile: { id: string; email: string; name: string; avatar?: string; emailVerified?: boolean }
  ): Promise<AuthResponse> {
    const providerIdField = provider === 'google' ? 'googleId' : 'githubId';

    // Check if user exists with this provider ID
    let user = await prisma.user.findFirst({
      where: { [providerIdField]: profile.id },
    });

    if (!user) {
      // Check if email already exists
      const existingByEmail = await prisma.user.findUnique({
        where: { email: profile.email },
      });

      if (existingByEmail) {
        // SECURITY: Only link OAuth if:
        // 1. The existing account has no password (was created via another OAuth)
        // 2. OR the OAuth provider confirms the email is verified
        // This prevents account takeover via unverified OAuth emails
        const canLink = !existingByEmail.password || profile.emailVerified !== false;

        if (!canLink) {
          throw new Error('An account with this email already exists. Please login with your password first, then link your OAuth account.');
        }

        // Link OAuth to existing account
        user = await prisma.user.update({
          where: { id: existingByEmail.id },
          data: {
            [providerIdField]: profile.id,
            // Only mark as verified if OAuth provider confirms it
            emailVerified: existingByEmail.emailVerified || profile.emailVerified !== false,
          },
        });
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            email: profile.email,
            name: profile.name,
            avatar: profile.avatar,
            [providerIdField]: profile.id,
            emailVerified: profile.emailVerified !== false,
          },
        });
      }
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return this.generateAuthResponse(user);
  }

  // Request password reset
  async requestPasswordReset(input: ResetPasswordRequestInput): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return { message: 'If an account exists, a reset email has been sent' };
    }

    // Delete any existing reset tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { userId: user.id, type: 'password_reset' },
    });

    // Generate reset token
    const resetToken = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token in dedicated table
    await prisma.verificationToken.create({
      data: {
        token: resetToken,
        type: 'password_reset',
        userId: user.id,
        expiresAt,
      },
    });

    // TODO: Send email with reset link
    // In production, integrate with email service (SendGrid, etc.)
    console.log(`Password reset token for ${user.email}: ${resetToken}`);

    return { message: 'If an account exists, a reset email has been sent' };
  }

  // Confirm password reset
  async confirmPasswordReset(input: ConfirmResetPasswordInput): Promise<{ message: string }> {
    const tokenRecord = await prisma.verificationToken.findFirst({
      where: { token: input.token, type: 'password_reset' },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new Error('Invalid or expired reset token');
    }

    if (tokenRecord.expiresAt < new Date()) {
      await prisma.verificationToken.delete({ where: { id: tokenRecord.id } });
      throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await hashPassword(input.password);

    // Update password and delete token in transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { password: hashedPassword },
      }),
      prisma.verificationToken.delete({ where: { id: tokenRecord.id } }),
      // Invalidate all refresh tokens for security
      prisma.refreshToken.deleteMany({
        where: { userId: tokenRecord.userId },
      }),
    ]);

    return { message: 'Password reset successfully' };
  }

  // Send verification email
  async sendVerificationEmail(userId: string): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.emailVerified) {
      return { message: 'Email already verified' };
    }

    // Delete any existing verification tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { userId: user.id, type: 'email_verify' },
    });

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store verification token
    await prisma.verificationToken.create({
      data: {
        token: verificationToken,
        type: 'email_verify',
        userId: user.id,
        expiresAt,
      },
    });

    // TODO: Send email with verification link
    console.log(`Verification token for ${user.email}: ${verificationToken}`);

    return { message: 'Verification email sent' };
  }

  // Verify email
  async verifyEmail(token: string): Promise<{ message: string }> {
    const tokenRecord = await prisma.verificationToken.findFirst({
      where: { token, type: 'email_verify' },
    });

    if (!tokenRecord) {
      throw new Error('Invalid or expired verification token');
    }

    if (tokenRecord.expiresAt < new Date()) {
      await prisma.verificationToken.delete({ where: { id: tokenRecord.id } });
      throw new Error('Invalid or expired verification token');
    }

    // Mark email as verified and delete token in transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { emailVerified: true },
      }),
      prisma.verificationToken.delete({ where: { id: tokenRecord.id } }),
    ]);

    return { message: 'Email verified successfully' };
  }

  // Generate auth response with tokens
  private async generateAuthResponse(user: {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    emailVerified: boolean;
    settings: unknown;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date | null;
  }): Promise<AuthResponse> {
    // Generate access token
    const accessToken = this.fastify.jwt.sign(
      { userId: user.id, email: user.email },
      { expiresIn: config.jwt.expiresIn }
    );

    // Generate refresh token
    const refreshToken = generateRefreshToken();
    const refreshExpiresIn = parseDuration(config.jwt.refreshExpiresIn);

    // Save refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + refreshExpiresIn),
      },
    });

    return {
      user: toUserResponse(user),
      accessToken,
      refreshToken,
      expiresIn: parseDuration(config.jwt.expiresIn) / 1000, // seconds
    };
  }
}
