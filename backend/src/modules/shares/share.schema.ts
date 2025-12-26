import { z } from 'zod';

// Create share schema
export const createShareSchema = z.object({
  promptId: z.string().optional(),
  collectionId: z.string().optional(),
  expiresIn: z.number().min(1).max(90).default(7), // days
  password: z.string().min(4).max(20).optional(),
}).refine(
  (data) => data.promptId || data.collectionId,
  { message: 'Either promptId or collectionId must be provided' }
);

// Access share schema
export const accessShareSchema = z.object({
  password: z.string().optional(),
});

// Types
export type CreateShareInput = z.infer<typeof createShareSchema>;
export type AccessShareInput = z.infer<typeof accessShareSchema>;
