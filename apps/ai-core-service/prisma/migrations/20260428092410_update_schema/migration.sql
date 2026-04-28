/*
  Warnings:

  - You are about to drop the column `uage_tokens` on the `ai_model_presets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ai_model_presets" DROP COLUMN "uage_tokens",
ADD COLUMN     "usage_tokens" INTEGER NOT NULL DEFAULT 10;
