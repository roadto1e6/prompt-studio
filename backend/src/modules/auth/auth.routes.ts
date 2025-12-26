import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from './auth.service.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  updateProfileSchema,
  resetPasswordRequestSchema,
  confirmResetPasswordSchema,
  verifyEmailSchema,
} from './auth.schema.js';
import { success, errors } from '../../utils/response.js';
import config from '../../config/index.js';
import { rateLimiters } from '../../middlewares/index.js';

// Extend FastifyRequest to include user
declare module 'fastify' {
  interface FastifyRequest {
    userId?: string;
  }
}

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService(fastify);

  // ============================================
  // Public routes
  // ============================================

  // POST /auth/register (with strict rate limiting)
  fastify.post('/register', { preHandler: rateLimiters.strict }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const input = registerSchema.parse(request.body);
      const result = await authService.register(input);
      success(reply, result, 201);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'Email already registered') {
          return errors.conflict(reply, err.message);
        }
        return errors.badRequest(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // POST /auth/login (with strict rate limiting)
  fastify.post('/login', { preHandler: rateLimiters.strict }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const input = loginSchema.parse(request.body);
      const result = await authService.login(input);
      success(reply, result);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'Invalid email or password') {
          return errors.unauthorized(reply, err.message);
        }
        return errors.badRequest(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // POST /auth/refresh
  fastify.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const input = refreshTokenSchema.parse(request.body);
      const result = await authService.refreshToken(input.refreshToken);
      success(reply, result);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('token')) {
          return errors.unauthorized(reply, err.message);
        }
        return errors.badRequest(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // POST /auth/forgot-password - Request password reset
  fastify.post('/forgot-password', { preHandler: rateLimiters.strict }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const input = resetPasswordRequestSchema.parse(request.body);
      const result = await authService.requestPasswordReset(input);
      success(reply, result);
    } catch (err) {
      if (err instanceof Error) {
        return errors.badRequest(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // POST /auth/reset-password - Confirm password reset
  fastify.post('/reset-password', { preHandler: rateLimiters.strict }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const input = confirmResetPasswordSchema.parse(request.body);
      const result = await authService.confirmPasswordReset(input);
      success(reply, result);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('token')) {
          return errors.badRequest(reply, err.message);
        }
        return errors.badRequest(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // POST /auth/verify-email - Verify email with token (public)
  fastify.post('/verify-email', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const input = verifyEmailSchema.parse(request.body);
      const result = await authService.verifyEmail(input.token);
      success(reply, result);
    } catch (err) {
      if (err instanceof Error) {
        return errors.badRequest(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // GET /auth/oauth/google - Get Google OAuth URL
  fastify.get('/oauth/google', async (request: FastifyRequest, reply: FastifyReply) => {
    const params = new URLSearchParams({
      client_id: config.google.clientId,
      redirect_uri: config.google.callbackUrl,
      response_type: 'code',
      scope: 'email profile',
      state: 'google',
    });
    success(reply, {
      url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    });
  });

  // GET /auth/oauth/google/callback - Handle Google OAuth callback
  fastify.get('/oauth/google/callback', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { code } = request.query as { code: string };

      if (!code) {
        return reply.redirect(`${config.frontendUrl}?error=no_code`);
      }

      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: config.google.clientId,
          client_secret: config.google.clientSecret,
          redirect_uri: config.google.callbackUrl,
          grant_type: 'authorization_code',
        }),
      });

      const tokens = await tokenResponse.json() as { access_token: string };

      // Get user info
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });

      const profile = await userResponse.json() as {
        id: string;
        email: string;
        name: string;
        picture?: string;
      };

      // Login/register with OAuth
      const result = await authService.oauthLogin('google', {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        avatar: profile.picture,
      });

      // Redirect to frontend with tokens
      const params = new URLSearchParams({
        access_token: result.accessToken,
        refresh_token: result.refreshToken,
      });
      reply.redirect(`${config.frontendUrl}?${params.toString()}`);
    } catch (err) {
      console.error('Google OAuth error:', err);
      reply.redirect(`${config.frontendUrl}?error=oauth_failed`);
    }
  });

  // GET /auth/oauth/github - Get GitHub OAuth URL
  fastify.get('/oauth/github', async (request: FastifyRequest, reply: FastifyReply) => {
    const params = new URLSearchParams({
      client_id: config.github.clientId,
      redirect_uri: config.github.callbackUrl,
      scope: 'user:email',
      state: 'github',
    });
    success(reply, {
      url: `https://github.com/login/oauth/authorize?${params.toString()}`,
    });
  });

  // GET /auth/oauth/github/callback - Handle GitHub OAuth callback
  fastify.get('/oauth/github/callback', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { code } = request.query as { code: string };

      if (!code) {
        return reply.redirect(`${config.frontendUrl}?error=no_code`);
      }

      // Exchange code for token
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: config.github.clientId,
          client_secret: config.github.clientSecret,
          code,
        }),
      });

      const tokens = await tokenResponse.json() as { access_token: string };

      // Get user info
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      const profile = await userResponse.json() as {
        id: number;
        email: string | null;
        name: string | null;
        login: string;
        avatar_url: string;
      };

      // Get email if not public
      let email = profile.email;
      if (!email) {
        const emailResponse = await fetch('https://api.github.com/user/emails', {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        });
        const emails = await emailResponse.json() as { email: string; primary: boolean }[];
        const primaryEmail = emails.find((e) => e.primary);
        email = primaryEmail?.email || emails[0]?.email;
      }

      if (!email) {
        return reply.redirect(`${config.frontendUrl}?error=no_email`);
      }

      // Login/register with OAuth
      const result = await authService.oauthLogin('github', {
        id: profile.id.toString(),
        email,
        name: profile.name || profile.login,
        avatar: profile.avatar_url,
      });

      // Redirect to frontend with tokens
      const params = new URLSearchParams({
        access_token: result.accessToken,
        refresh_token: result.refreshToken,
      });
      reply.redirect(`${config.frontendUrl}?${params.toString()}`);
    } catch (err) {
      console.error('GitHub OAuth error:', err);
      reply.redirect(`${config.frontendUrl}?error=oauth_failed`);
    }
  });

  // ============================================
  // Protected routes (require authentication)
  // ============================================

  // Authentication hook for protected routes
  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook('onRequest', async (request, reply) => {
      try {
        await request.jwtVerify();
        const decoded = request.user as { userId: string };
        request.userId = decoded.userId;
      } catch {
        return errors.unauthorized(reply, 'Invalid or expired token');
      }
    });

    // POST /auth/logout
    protectedRoutes.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { refreshToken } = (request.body as { refreshToken?: string }) || {};
        await authService.logout(request.userId!, refreshToken);
        success(reply, { message: 'Logged out successfully' });
      } catch (err) {
        return errors.internal(reply);
      }
    });

    // GET /auth/me
    protectedRoutes.get('/me', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = await authService.getCurrentUser(request.userId!);
        success(reply, user);
      } catch (err) {
        if (err instanceof Error && err.message === 'User not found') {
          return errors.notFound(reply, err.message);
        }
        return errors.internal(reply);
      }
    });

    // PATCH /auth/profile
    protectedRoutes.patch('/profile', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const input = updateProfileSchema.parse(request.body);
        const user = await authService.updateProfile(request.userId!, input);
        success(reply, user);
      } catch (err) {
        if (err instanceof Error) {
          return errors.badRequest(reply, err.message);
        }
        return errors.internal(reply);
      }
    });

    // POST /auth/change-password
    protectedRoutes.post('/change-password', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const input = changePasswordSchema.parse(request.body);
        await authService.changePassword(request.userId!, input);
        success(reply, { message: 'Password changed successfully' });
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === 'Current password is incorrect') {
            return errors.unauthorized(reply, err.message);
          }
          return errors.badRequest(reply, err.message);
        }
        return errors.internal(reply);
      }
    });

    // POST /auth/send-verification - Send email verification
    protectedRoutes.post('/send-verification', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const result = await authService.sendVerificationEmail(request.userId!);
        success(reply, result);
      } catch (err) {
        if (err instanceof Error) {
          return errors.badRequest(reply, err.message);
        }
        return errors.internal(reply);
      }
    });
  });
}
