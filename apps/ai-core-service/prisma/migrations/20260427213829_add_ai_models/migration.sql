-- CreateTable
CREATE TABLE "ai_model_presets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "stars" INTEGER NOT NULL DEFAULT 1,
    "uage_tokens" INTEGER NOT NULL DEFAULT 10,
    "paid_tier" TEXT,
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0,
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
    "ai_model_preset_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "preset_id" TEXT NOT NULL,

    CONSTRAINT "user_presets_pkey" PRIMARY KEY ("account_id","preset_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ai_model_presets_name_key" ON "ai_model_presets"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ai_external_models_name_key" ON "ai_external_models"("name");

-- AddForeignKey
ALTER TABLE "ai_model_presets" ADD CONSTRAINT "ai_model_presets_ai_external_model_id_fkey" FOREIGN KEY ("ai_external_model_id") REFERENCES "ai_external_models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_presets" ADD CONSTRAINT "user_presets_preset_id_fkey" FOREIGN KEY ("preset_id") REFERENCES "ai_model_presets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
