import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { config } from './config/index.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { promptRoutes } from './modules/prompts/prompt.routes.js';
import { collectionRoutes } from './modules/collections/collection.routes.js';
import { shareRoutes } from './modules/shares/share.routes.js';
import { modelRoutes } from './modules/models/model.routes.js';
import { rateLimitPlugin, requestLoggerPlugin, errorHandlerPlugin, securityHeaders } from './middlewares/index.js';
import { startScheduler, stopScheduler } from './utils/scheduler.js';

// Extend FastifyRequest type
declare module 'fastify' {
  interface FastifyRequest {
    userId?: string;
    requestId?: string;
    startTime?: bigint;
  }
}

async function buildApp() {
  const fastify = Fastify({
    logger: {
      level: config.nodeEnv === 'development' ? 'debug' : 'info',
      transport:
        config.nodeEnv === 'development'
          ? {
              target: 'pino-pretty',
              options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
              },
            }
          : undefined,
    },
  });

  // ============================================
  // Core Plugins
  // ============================================

  // Register CORS
  await fastify.register(cors, {
    origin: config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Register JWT
  await fastify.register(jwt, {
    secret: config.jwtSecret,
    sign: {
      expiresIn: config.jwtExpiresIn,
    },
  });

  // ============================================
  // Custom Middlewares
  // ============================================

  // Security headers
  await fastify.register(securityHeaders);

  // Request logging
  await fastify.register(requestLoggerPlugin);

  // Rate limiting
  await fastify.register(rateLimitPlugin);

  // Error handling
  await fastify.register(errorHandlerPlugin);

  // ============================================
  // Health & Info Routes
  // ============================================

  // Health check
  fastify.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  });

  // API info
  fastify.get('/', async () => {
    return {
      name: 'Prompt Studio API',
      version: '1.0.0',
      environment: config.nodeEnv,
      endpoints: {
        auth: '/api/auth',
        prompts: '/api/prompts',
        collections: '/api/collections',
        shares: '/api/shares',
      },
      docs: {
        health: '/health',
      },
    };
  });

  // ============================================
  // API Routes
  // ============================================

  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(promptRoutes, { prefix: '/api/prompts' });
  await fastify.register(collectionRoutes, { prefix: '/api/collections' });
  await fastify.register(shareRoutes, { prefix: '/api/shares' });
  await fastify.register(modelRoutes, { prefix: '/api/models' });

  return fastify;
}

async function start() {
  try {
    const app = await buildApp();

    // Start scheduled tasks
    startScheduler();

    // Graceful shutdown
    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        console.log(`\nReceived ${signal}, shutting down gracefully...`);
        stopScheduler();
        await app.close();
        process.exit(0);
      });
    });

    await app.listen({
      port: config.port,
      host: '0.0.0.0',
    });

    console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║   🚀 Prompt Studio API                             ║
║                                                    ║
║   Server running at:                               ║
║   http://localhost:${String(config.port).padEnd(29)}║
║                                                    ║
║   Environment: ${config.nodeEnv.padEnd(27)}║
║                                                    ║
║   Endpoints:                                       ║
║   • Auth:        /api/auth                         ║
║   • Prompts:     /api/prompts                      ║
║   • Collections: /api/collections                  ║
║   • Shares:      /api/shares                       ║
║   • Models:      /api/models                       ║
║                                                    ║
╚════════════════════════════════════════════════════╝
    `);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
