-- CreateEnum
CREATE TYPE "analyse_statuses" AS ENUM ('WAITING', 'DONE', 'CANCELLED');

-- CreateTable
CREATE TABLE "ai_model_presets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "stars" INTEGER NOT NULL DEFAULT 1,
    "usage_credits" INTEGER NOT NULL DEFAULT 10,
    "paid_tier" TEXT DEFAULT 'Free',
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "systemPrompt" TEXT NOT NULL DEFAULT '',
    "max_tokens" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "ai_external_model_id" TEXT NOT NULL,

    CONSTRAINT "ai_model_presets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_external_models" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_external_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_presets" (
    "account_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "preset_id" TEXT NOT NULL,

    CONSTRAINT "user_presets_pkey" PRIMARY KEY ("account_id","preset_id")
);

-- CreateTable
CREATE TABLE "customer_profiles" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "years_old" INTEGER,
    "location" TEXT DEFAULT 'Not specified',
    "predicated_position" TEXT,
    "current_position" TEXT,
    "resume_score" INTEGER,
    "summary" TEXT,
    "achivements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "level" TEXT,
    "expected_salary_from" INTEGER DEFAULT 0,
    "expected_salary_to" INTEGER DEFAULT 0,
    "tags" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_analyse_job" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "total_tokens" INTEGER NOT NULL DEFAULT 0,
    "completion_tokens" INTEGER NOT NULL DEFAULT 0,
    "prompt_tokens" INTEGER NOT NULL DEFAULT 0,
    "spent_credits" INTEGER NOT NULL DEFAULT 0,
    "status" "analyse_statuses" NOT NULL DEFAULT 'WAITING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "preset_id" TEXT NOT NULL,

    CONSTRAINT "ai_analyse_job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ai_model_presets_name_key" ON "ai_model_presets"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ai_external_models_name_key" ON "ai_external_models"("name");

-- CreateIndex
CREATE INDEX "customer_profiles_tags_idx" ON "customer_profiles" USING GIN ("tags");

-- CreateIndex
CREATE INDEX "customer_profiles_current_position_idx" ON "customer_profiles"("current_position");

-- AddForeignKey
ALTER TABLE "ai_model_presets" ADD CONSTRAINT "ai_model_presets_ai_external_model_id_fkey" FOREIGN KEY ("ai_external_model_id") REFERENCES "ai_external_models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_presets" ADD CONSTRAINT "user_presets_preset_id_fkey" FOREIGN KEY ("preset_id") REFERENCES "ai_model_presets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_analyse_job" ADD CONSTRAINT "ai_analyse_job_preset_id_fkey" FOREIGN KEY ("preset_id") REFERENCES "ai_model_presets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
