/*
  Warnings:

  - You are about to drop the `custom_models` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_model_configs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "custom_models" DROP CONSTRAINT "custom_models_userId_fkey";

-- DropForeignKey
ALTER TABLE "models" DROP CONSTRAINT "models_providerId_fkey";

-- DropForeignKey
ALTER TABLE "user_model_configs" DROP CONSTRAINT "user_model_configs_modelId_fkey";

-- DropForeignKey
ALTER TABLE "user_model_configs" DROP CONSTRAINT "user_model_configs_userId_fkey";

-- AlterTable
ALTER TABLE "model_providers" ADD COLUMN     "contributedBy" TEXT;

-- AlterTable
ALTER TABLE "models" ADD COLUMN     "contributedBy" TEXT,
ADD COLUMN     "useCount" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "custom_models";

-- DropTable
DROP TABLE "user_model_configs";

-- CreateIndex
CREATE INDEX "model_providers_contributedBy_idx" ON "model_providers"("contributedBy");

-- CreateIndex
CREATE INDEX "models_contributedBy_idx" ON "models"("contributedBy");

-- CreateIndex
CREATE INDEX "models_useCount_idx" ON "models"("useCount");

-- AddForeignKey
ALTER TABLE "models" ADD CONSTRAINT "models_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "model_providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
