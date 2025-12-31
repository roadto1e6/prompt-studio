import { z } from 'zod';

// Model capability enum
export const modelCapabilityEnum = z.enum(['text', 'image', 'audio', 'video', 'embedding', 'vision']);

// Model status enum
export const modelStatusEnum = z.enum(['active', 'deprecated', 'beta']);

// Model source type enum
export const modelSourceTypeEnum = z.enum(['system', 'user']);

// User model review status enum
export const userModelReviewStatusEnum = z.enum(['pending', 'approved', 'rejected']);

// ============================================
// Provider Schemas
// ============================================

// Create provider schema
export const createProviderSchema = z.object({
  id: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/, 'ID must be lowercase alphanumeric with hyphens'),
  name: z.string().min(1, 'Name is required').max(100),
  website: z.string().url().optional().or(z.literal('')),
  apiDocsUrl: z.string().url().optional().or(z.literal('')),
  description: z.string().max(500).optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
});

// Update provider schema
export const updateProviderSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  website: z.string().url().optional().or(z.literal('')),
  apiDocsUrl: z.string().url().optional().or(z.literal('')),
  description: z.string().max(500).optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().optional(),
});

// ============================================
// Model Schemas
// ============================================

// Model pricing schema
const modelPricingSchema = z.object({
  inputPer1kTokens: z.number().optional(),
  outputPer1kTokens: z.number().optional(),
  perImage: z.number().optional(),
  perMinute: z.number().optional(),
  currency: z.string().default('USD'),
}).optional();

// Model features schema
const modelFeaturesSchema = z.object({
  streaming: z.boolean().optional(),
  vision: z.boolean().optional(),
  functionCalling: z.boolean().optional(),
  jsonMode: z.boolean().optional(),
}).optional();

// Create model schema
export const createModelSchema = z.object({
  id: z.string().min(1).max(100).regex(/^[a-z0-9-_.]+$/, 'ID must be lowercase alphanumeric with hyphens, underscores, or dots'),
  name: z.string().min(1, 'Name is required').max(100),
  providerId: z.string().min(1, 'Provider is required'),
  capabilities: z.array(modelCapabilityEnum).min(1, 'At least one capability required'),
  maxTokens: z.number().min(1, 'Max tokens is required'),
  contextWindow: z.number().min(1).optional(),
  status: modelStatusEnum.optional().default('active'),
  description: z.string().max(1000).optional(),
  releasedAt: z.string().datetime().optional(),
  defaultTemperature: z.number().min(0).max(2).optional(),
  defaultMaxTokens: z.number().min(1).optional(),
  pricing: modelPricingSchema,
  features: modelFeaturesSchema,
});

// Update model schema
export const updateModelSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  capabilities: z.array(modelCapabilityEnum).min(1).optional(),
  maxTokens: z.number().min(1).optional(),
  contextWindow: z.number().min(1).optional(),
  status: modelStatusEnum.optional(),
  description: z.string().max(1000).optional(),
  releasedAt: z.string().datetime().optional(),
  defaultTemperature: z.number().min(0).max(2).optional(),
  defaultMaxTokens: z.number().min(1).optional(),
  pricing: modelPricingSchema,
  features: modelFeaturesSchema,
});

// Query params
export const queryModelsSchema = z.object({
  category: modelCapabilityEnum.optional(),
  providerId: z.string().optional(),
  status: modelStatusEnum.optional(),
  search: z.string().optional(),
  sourceType: modelSourceTypeEnum.optional(),
  includeUserModels: z.coerce.boolean().optional(), // Include user's own models
});

// ============================================
// User Custom Model Schemas
// ============================================

// Create user custom model schema
export const createUserModelSchema = z.object({
  id: z.string().min(1).max(100).regex(/^[a-z0-9-_.]+$/, 'ID must be lowercase alphanumeric with hyphens, underscores, or dots'),
  name: z.string().min(1, 'Name is required').max(100),
  providerId: z.string().min(1, 'Provider is required'),
  capabilities: z.array(modelCapabilityEnum).min(1, 'At least one capability required'),
  maxTokens: z.number().min(1, 'Max tokens is required'),
  contextWindow: z.number().min(1).optional(),
  description: z.string().max(1000).optional(),
  features: modelFeaturesSchema,
});

// Update user custom model schema
export const updateUserModelSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  capabilities: z.array(modelCapabilityEnum).min(1).optional(),
  maxTokens: z.number().min(1).optional(),
  contextWindow: z.number().min(1).optional(),
  description: z.string().max(1000).optional(),
  features: modelFeaturesSchema,
});

// Review user model schema (admin only)
export const reviewUserModelSchema = z.object({
  status: userModelReviewStatusEnum,
  reason: z.string().max(500).optional(),
});

// ============================================
// Types
// ============================================

export type CreateProviderInput = z.infer<typeof createProviderSchema>;
export type UpdateProviderInput = z.infer<typeof updateProviderSchema>;
export type CreateModelInput = z.infer<typeof createModelSchema>;
export type UpdateModelInput = z.infer<typeof updateModelSchema>;
export type QueryModelsInput = z.infer<typeof queryModelsSchema>;
export type CreateUserModelInput = z.infer<typeof createUserModelSchema>;
export type UpdateUserModelInput = z.infer<typeof updateUserModelSchema>;
export type ReviewUserModelInput = z.infer<typeof reviewUserModelSchema>;
