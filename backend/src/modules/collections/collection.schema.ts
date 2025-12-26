import { z } from 'zod';

// Create collection schema
export const createCollectionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  color: z.string().default('text-blue-500'),
  icon: z.string().default('Folder'),
});

// Update collection schema
export const updateCollectionSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

// Query params schema
export const queryCollectionsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  sortBy: z.enum(['updatedAt', 'createdAt', 'name']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Types
export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;
export type QueryCollectionsInput = z.infer<typeof queryCollectionsSchema>;
