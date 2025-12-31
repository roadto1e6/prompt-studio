import { z } from 'zod';

// Category enum
export const categoryEnum = z.enum(['text', 'image', 'audio', 'video']);

// Status enum
export const statusEnum = z.enum(['active', 'archived', 'trash']);

// Create prompt schema
export const createPromptSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  category: categoryEnum.default('text'),
  systemPrompt: z.string().optional(),
  model: z.string().default('gpt-4-turbo'),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().min(1).max(128000).default(2048),
  tags: z.array(z.string()).default([]),
  collectionId: z.string().nullable().optional(),
});

// Update prompt schema
export const updatePromptSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  category: categoryEnum.optional(),
  systemPrompt: z.string().optional(),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(128000).optional(),
  tags: z.array(z.string()).optional(),
  collectionId: z.string().nullable().optional(),
  favorite: z.boolean().optional(),
  status: statusEnum.optional(),
});

// Query params schema
export const queryPromptsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  category: categoryEnum.optional(),
  collectionId: z.string().optional(),
  status: statusEnum.optional(),
  favorite: z.coerce.boolean().optional(),
  sortBy: z.enum(['updatedAt', 'createdAt', 'title']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  tags: z.string().optional(), // comma-separated
});

// Create version schema
export const createVersionSchema = z.object({
  changeNote: z.string().max(500).default(''),
  versionType: z.enum(['major', 'minor']).default('minor'),
});

// Batch update schema
export const batchUpdateSchema = z.object({
  ids: z.array(z.string()).min(1, 'At least one ID is required'),
  collectionId: z.string().nullable().optional(),
  favorite: z.boolean().optional(),
  status: statusEnum.optional(),
  tags: z.array(z.string()).optional(),
});

// Batch delete schema
export const batchDeleteSchema = z.object({
  ids: z.array(z.string()).min(1, 'At least one ID is required'),
});

// Types
export type CreatePromptInput = z.infer<typeof createPromptSchema>;
export type UpdatePromptInput = z.infer<typeof updatePromptSchema>;
export type QueryPromptsInput = z.infer<typeof queryPromptsSchema>;
export type CreateVersionInput = z.infer<typeof createVersionSchema>;
export type BatchUpdateInput = z.infer<typeof batchUpdateSchema>;
export type BatchDeleteInput = z.infer<typeof batchDeleteSchema>;
