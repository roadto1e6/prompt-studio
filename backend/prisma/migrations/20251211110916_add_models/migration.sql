-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "googleId" TEXT,
    "githubId" TEXT,
    "settings" JSONB NOT NULL DEFAULT '{"language":"en","theme":"dark","defaultModel":"gpt-4-turbo","emailNotifications":true}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT 'text',
    "systemPrompt" TEXT NOT NULL DEFAULT '',
    "userTemplate" TEXT NOT NULL DEFAULT '',
    "model" TEXT NOT NULL DEFAULT 'gpt-4-turbo',
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "maxTokens" INTEGER NOT NULL DEFAULT 2048,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'active',
    "currentVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "collectionId" TEXT,

    CONSTRAINT "prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_versions" (
    "id" TEXT NOT NULL,
    "versionNumber" TEXT NOT NULL,
    "systemPrompt" TEXT NOT NULL,
    "userTemplate" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "maxTokens" INTEGER NOT NULL,
    "changeNote" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "promptId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "prompt_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "color" TEXT NOT NULL DEFAULT 'text-blue-500',
    "icon" TEXT NOT NULL DEFAULT 'Folder',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shares" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "password" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "shares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "model_providers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "apiDocsUrl" TEXT,
    "description" TEXT,
    "logoUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "model_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "models" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "capabilities" TEXT[],
    "maxTokens" INTEGER NOT NULL,
    "contextWindow" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "description" TEXT,
    "releasedAt" TIMESTAMP(3),
    "defaultTemperature" DOUBLE PRECISION,
    "defaultMaxTokens" INTEGER,
    "pricing" JSONB,
    "features" JSONB,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_model_configs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "alias" TEXT,
    "apiKeyEncrypted" TEXT,
    "customEndpoint" TEXT,
    "customParams" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_model_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_models" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'custom',
    "capabilities" TEXT[],
    "maxTokens" INTEGER NOT NULL,
    "contextWindow" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "description" TEXT,
    "apiEndpoint" TEXT NOT NULL,
    "apiKeyEncrypted" TEXT,
    "defaultParams" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_models_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "users_githubId_key" ON "users"("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "prompts_userId_idx" ON "prompts"("userId");

-- CreateIndex
CREATE INDEX "prompts_collectionId_idx" ON "prompts"("collectionId");

-- CreateIndex
CREATE INDEX "prompts_status_idx" ON "prompts"("status");

-- CreateIndex
CREATE INDEX "prompts_favorite_idx" ON "prompts"("favorite");

-- CreateIndex
CREATE INDEX "prompts_userId_status_idx" ON "prompts"("userId", "status");

-- CreateIndex
CREATE INDEX "prompts_userId_favorite_idx" ON "prompts"("userId", "favorite");

-- CreateIndex
CREATE INDEX "prompts_createdAt_idx" ON "prompts"("createdAt");

-- CreateIndex
CREATE INDEX "prompts_updatedAt_idx" ON "prompts"("updatedAt");

-- CreateIndex
CREATE INDEX "prompt_versions_promptId_idx" ON "prompt_versions"("promptId");

-- CreateIndex
CREATE INDEX "collections_userId_idx" ON "collections"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "shares_code_key" ON "shares"("code");

-- CreateIndex
CREATE INDEX "shares_code_idx" ON "shares"("code");

-- CreateIndex
CREATE INDEX "shares_userId_idx" ON "shares"("userId");

-- CreateIndex
CREATE INDEX "models_providerId_idx" ON "models"("providerId");

-- CreateIndex
CREATE INDEX "models_status_idx" ON "models"("status");

-- CreateIndex
CREATE INDEX "user_model_configs_userId_idx" ON "user_model_configs"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_model_configs_userId_modelId_key" ON "user_model_configs"("userId", "modelId");

-- CreateIndex
CREATE INDEX "custom_models_userId_idx" ON "custom_models"("userId");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_versions" ADD CONSTRAINT "prompt_versions_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "prompts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares" ADD CONSTRAINT "shares_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "models" ADD CONSTRAINT "models_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "model_providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_model_configs" ADD CONSTRAINT "user_model_configs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_model_configs" ADD CONSTRAINT "user_model_configs_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_models" ADD CONSTRAINT "custom_models_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
