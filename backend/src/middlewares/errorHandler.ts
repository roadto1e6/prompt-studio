import { FastifyInstance, FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { config } from '../config/index.js';

// Custom API Error class
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static badRequest(message: string, details?: unknown) {
    return new ApiError(400, 'BAD_REQUEST', message, details);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, 'UNAUTHORIZED', message);
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(403, 'FORBIDDEN', message);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, 'NOT_FOUND', message);
  }

  static conflict(message: string) {
    return new ApiError(409, 'CONFLICT', message);
  }

  static tooManyRequests(message = 'Too many requests') {
    return new ApiError(429, 'TOO_MANY_REQUESTS', message);
  }

  static internal(message = 'Internal server error') {
    return new ApiError(500, 'INTERNAL_ERROR', message);
  }
}

// Format Zod errors
function formatZodError(error: ZodError) {
  return error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code,
  }));
}

// Format Prisma errors
function formatPrismaError(error: Prisma.PrismaClientKnownRequestError) {
  switch (error.code) {
    case 'P2002':
      // Unique constraint violation
      const target = (error.meta?.target as string[]) || ['field'];
      return {
        statusCode: 409,
        code: 'DUPLICATE_ENTRY',
        message: `${target.join(', ')} already exists`,
      };
    case 'P2025':
      // Record not found
      return {
        statusCode: 404,
        code: 'NOT_FOUND',
        message: 'Record not found',
      };
    case 'P2003':
      // Foreign key constraint
      return {
        statusCode: 400,
        code: 'FOREIGN_KEY_ERROR',
        message: 'Related record not found',
      };
    default:
      return {
        statusCode: 500,
        code: 'DATABASE_ERROR',
        message: config.nodeEnv === 'development' ? error.message : 'Database error',
      };
  }
}

export async function errorHandlerPlugin(fastify: FastifyInstance) {
  fastify.setErrorHandler(
    (error: FastifyError | Error, request: FastifyRequest, reply: FastifyReply) => {
      fastify.log.error(error);

      // Handle API errors
      if (error instanceof ApiError) {
        return reply.status(error.statusCode).send({
          success: false,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
        });
      }

      // Handle Zod validation errors
      if (error instanceof ZodError) {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: formatZodError(error),
          },
        });
      }

      // Handle Prisma errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const formatted = formatPrismaError(error);
        return reply.status(formatted.statusCode).send({
          success: false,
          error: {
            code: formatted.code,
            message: formatted.message,
          },
        });
      }

      // Handle Prisma validation errors
      if (error instanceof Prisma.PrismaClientValidationError) {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid data provided',
          },
        });
      }

      // Handle JWT errors
      if ('code' in error) {
        if (error.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER') {
          return reply.status(401).send({
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authorization header required',
            },
          });
        }

        if (error.code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED') {
          return reply.status(401).send({
            success: false,
            error: {
              code: 'TOKEN_EXPIRED',
              message: 'Token has expired',
            },
          });
        }

        if (error.code === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID') {
          return reply.status(401).send({
            success: false,
            error: {
              code: 'INVALID_TOKEN',
              message: 'Invalid token',
            },
          });
        }
      }

      // Default error response
      const statusCode = 'statusCode' in error ? (error.statusCode as number) : 500;
      return reply.status(statusCode).send({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: config.nodeEnv === 'development' ? error.message : 'Internal server error',
        },
      });
    }
  );

  // 404 handler
  fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${request.method} ${request.url} not found`,
      },
    });
  });
}
