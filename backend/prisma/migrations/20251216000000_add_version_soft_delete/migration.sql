-- AlterTable
ALTER TABLE "prompt_versions" ADD COLUMN "deleted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "prompt_versions" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "prompt_versions_deleted_idx" ON "prompt_versions"("deleted");
