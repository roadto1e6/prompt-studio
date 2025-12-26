import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

interface RequestLogData {
  requestId: string;
  method: string;
  url: string;
  ip: string;
  userAgent: string;
  userId?: string;
  statusCode: number;
  responseTime: number;
  timestamp: string;
}

// Generate unique request ID
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Format bytes to human readable
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export async function requestLoggerPlugin(fastify: FastifyInstance) {
  // Add request ID to each request
  fastify.addHook('onRequest', async (request, reply) => {
    const requestId = generateRequestId();
    request.requestId = requestId;
    reply.header('X-Request-ID', requestId);

    // Store start time
    request.startTime = process.hrtime.bigint();
  });

  // Log response
  fastify.addHook('onResponse', async (request, reply) => {
    const endTime = process.hrtime.bigint();
    const startTime = request.startTime || endTime;
    const responseTime = Number(endTime - startTime) / 1e6; // Convert to ms

    const logData: RequestLogData = {
      requestId: request.requestId || 'unknown',
      method: request.method,
      url: request.url,
      ip: request.ip,
      userAgent: request.headers['user-agent'] || 'unknown',
      userId: request.userId,
      statusCode: reply.statusCode,
      responseTime: Math.round(responseTime * 100) / 100,
      timestamp: new Date().toISOString(),
    };

    // Log based on status code
    if (reply.statusCode >= 500) {
      fastify.log.error(logData, 'Request error');
    } else if (reply.statusCode >= 400) {
      fastify.log.warn(logData, 'Request warning');
    } else {
      fastify.log.info(logData, 'Request completed');
    }
  });

  // Log errors
  fastify.addHook('onError', async (request, reply, error) => {
    fastify.log.error(
      {
        requestId: request.requestId,
        method: request.method,
        url: request.url,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      },
      'Request error occurred'
    );
  });
}

// Extend FastifyRequest type
declare module 'fastify' {
  interface FastifyRequest {
    requestId?: string;
    startTime?: bigint;
  }
}
