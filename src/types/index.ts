/**
 * Types Index
 * 统一导出所有类型定义
 */

// ============ Common Types ============
export type {
  ApiResponse,
  PaginatedResponse,
  Pagination,
  ApiErrorResponse,
  SortOrder,
  BaseQueryParams,
  TimestampedEntity,
  SoftDeletableEntity,
  Language,
  Theme,
} from './common';

// ============ Auth Types ============
export type {
  User,
  UserSettings,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshResponse,
  ResetPasswordRequest,
  ConfirmResetPasswordRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
} from './auth';

// ============ Prompt Types ============
export type {
  Category,
  PromptStatus,
  Prompt,
  PromptVersion,
  CreatePromptRequest,
  UpdatePromptRequest,
  CreateVersionRequest,
  PromptSortBy,
  PromptSortBy as SortBy,  // Alias for backward compatibility
  PromptQueryParams,
  QuickFilter,
  ViewMode,
  TabType,
} from './prompt';

// ============ Collection Types ============
export type {
  Collection,
  CreateCollectionRequest,
  UpdateCollectionRequest,
  CollectionSortBy,
  CollectionQueryParams,
} from './collection';

// ============ Share Types ============
export type {
  SharedPromptData,
  ShareRecord,
  CreateShareRequest,
  CreateShareResponse,
  GetShareResponse,
  MyShareRecord,
} from './share';

// ============ Model Types ============
export type {
  ModelCapability,
  ModelStatus,
  ModelSourceType,
  UserModelReviewStatus,
  Provider,
  Model,
  UserCustomModel,
  ModelPricing,
  ModelFeatures,
  CreateProviderRequest,
  UpdateProviderRequest,
  CreateModelRequest,
  CreateUserModelRequest,
  UpdateUserModelRequest,
  UpdateModelRequest,
  QueryModelsParams,
  GetModelsResponse,
  ModelStatsResponse,
  ModelOption,
  GroupedModelOptions,
  GetModelOptionsParams,
} from './model';

// ============ UI Types ============
export type ModalType =
  | 'createPrompt'
  | 'createCollection'
  | 'settings'
  | 'deleteConfirm'
  | 'sharePrompt'
  | 'importPrompt'
  | 'modelConfig';  // 新增模型配置弹窗
