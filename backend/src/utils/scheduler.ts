import prisma from '../config/database.js';

/**
 * Scheduled cleanup tasks
 * Runs periodically to clean up expired data
 */

// Cleanup interval (default: 1 hour)
const CLEANUP_INTERVAL = parseInt(process.env.CLEANUP_INTERVAL_MS || '3600000', 10);

// Trash retention days (default: 30 days)
const TRASH_RETENTION_DAYS = parseInt(process.env.TRASH_RETENTION_DAYS || '30', 10);

let cleanupTimer: NodeJS.Timeout | null = null;

/**
 * Clean up expired shares
 */
async function cleanupExpiredShares(): Promise<number> {
  const result = await prisma.share.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  return result.count;
}

/**
 * Clean up expired refresh tokens
 */
async function cleanupExpiredRefreshTokens(): Promise<number> {
  const result = await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  return result.count;
}

/**
 * Clean up expired verification tokens
 */
async function cleanupExpiredVerificationTokens(): Promise<number> {
  const result = await prisma.verificationToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  return result.count;
}

/**
 * Clean up old trashed prompts (permanently delete after retention period)
 */
async function cleanupTrashedPrompts(): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - TRASH_RETENTION_DAYS);

  const result = await prisma.prompt.deleteMany({
    where: {
      status: 'trash',
      updatedAt: {
        lt: cutoffDate,
      },
    },
  });
  return result.count;
}

/**
 * Run all cleanup tasks
 */
async function runCleanup(): Promise<void> {
  try {
    const [shares, refreshTokens, verificationTokens, trashedPrompts] = await Promise.all([
      cleanupExpiredShares(),
      cleanupExpiredRefreshTokens(),
      cleanupExpiredVerificationTokens(),
      cleanupTrashedPrompts(),
    ]);

    const hasCleanup = shares > 0 || refreshTokens > 0 || verificationTokens > 0 || trashedPrompts > 0;
    if (hasCleanup) {
      const msg = '[Scheduler] Cleanup completed: ' + shares + ' shares, ' + refreshTokens + ' refresh tokens, ' + verificationTokens + ' verification tokens, ' + trashedPrompts + ' trashed prompts removed';
      console.log(msg);
    }
  } catch (error) {
    console.error('[Scheduler] Cleanup error:', error);
  }
}

/**
 * Start the cleanup scheduler
 */
export function startScheduler(): void {
  if (cleanupTimer) {
    return; // Already running
  }

  // Run cleanup immediately on start
  runCleanup();

  // Schedule periodic cleanup
  cleanupTimer = setInterval(runCleanup, CLEANUP_INTERVAL);

  const intervalSeconds = CLEANUP_INTERVAL / 1000;
  console.log('[Scheduler] Started with ' + intervalSeconds + 's interval');
}

/**
 * Stop the cleanup scheduler
 */
export function stopScheduler(): void {
  if (cleanupTimer) {
    clearInterval(cleanupTimer);
    cleanupTimer = null;
    console.log('[Scheduler] Stopped');
  }
}

/**
 * Manually trigger cleanup (useful for testing)
 */
export async function triggerCleanup(): Promise<{
  shares: number;
  refreshTokens: number;
  verificationTokens: number;
  trashedPrompts: number;
}> {
  const [shares, refreshTokens, verificationTokens, trashedPrompts] = await Promise.all([
    cleanupExpiredShares(),
    cleanupExpiredRefreshTokens(),
    cleanupExpiredVerificationTokens(),
    cleanupTrashedPrompts(),
  ]);

  return { shares, refreshTokens, verificationTokens, trashedPrompts };
}
