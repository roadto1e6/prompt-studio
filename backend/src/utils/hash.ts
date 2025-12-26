import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SALT_ROUNDS = 12;

// Get encryption key from environment or generate a default for development
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-encryption-key-32chars!';
const ENCRYPTION_IV_LENGTH = 16;
const ENCRYPTION_ALGORITHM = 'aes-256-cbc';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Encrypt sensitive data (like API keys)
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(ENCRYPTION_IV_LENGTH);
  const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt sensitive data
 */
export function decrypt(encryptedText: string): string {
  const [ivHex, encrypted] = encryptedText.split(':');
  if (!ivHex || !encrypted) {
    throw new Error('Invalid encrypted text format');
  }
  const iv = Buffer.from(ivHex, 'hex');
  const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
  const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
