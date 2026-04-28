/*
  Warnings:

  - You are about to drop the column `ai_model_preset_id` on the `user_presets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_presets" DROP COLUMN "ai_model_preset_id";
