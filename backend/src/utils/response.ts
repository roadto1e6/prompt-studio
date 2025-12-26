import { FastifyReply } from 'fastify';

// Standard API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Success response helper
export function success<T>(reply: FastifyReply, data: T, statusCode = 200): void {
  reply.status(statusCode).send({
    success: true,
    data,
  });
}

// Paginated response helper
export function paginated<T>(
  reply: FastifyReply,
  items: T[],
  total: number,
  page: number,
  pageSize: number
): void {
  reply.status(200).send({
    success: true,
    data: {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  });
}

// Error response helper
export function error(
  reply: FastifyReply,
  message: string,
  statusCode = 400,
  code?: string
): void {
  reply.status(statusCode).send({
    success: false,
    error: message,
    code,
  });
}

// Common error responses
export const errors = {
  badRequest: (reply: FastifyReply, message = 'Bad request') =>
    error(reply, message, 400, 'BAD_REQUEST'),

  unauthorized: (reply: FastifyReply, message = 'Unauthorized') =>
    error(reply, message, 401, 'UNAUTHORIZED'),

  forbidden: (reply: FastifyReply, message = 'Forbidden') =>
    error(reply, message, 403, 'FORBIDDEN'),

  notFound: (reply: FastifyReply, message = 'Not found') =>
    error(reply, message, 404, 'NOT_FOUND'),

  conflict: (reply: FastifyReply, message = 'Conflict') =>
    error(reply, message, 409, 'CONFLICT'),

  tooManyRequests: (reply: FastifyReply, message = 'Too many requests') =>
    error(reply, message, 429, 'TOO_MANY_REQUESTS'),

  internal: (reply: FastifyReply, message = 'Internal server error') =>
    error(reply, message, 500, 'INTERNAL_ERROR'),
};
