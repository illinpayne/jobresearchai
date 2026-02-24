/*
  Warnings:

  - You are about to drop the `social_accounts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "social_accounts" DROP CONSTRAINT "social_accounts_account_id_fkey";

-- DropTable
DROP TABLE "social_accounts";

-- CreateTable
CREATE TABLE "providers" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'internal',
    "account_id" TEXT NOT NULL,

    CONSTRAINT "providers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "providers_provider_id_key" ON "providers"("provider", "id");

-- AddForeignKey
ALTER TABLE "providers" ADD CONSTRAINT "providers_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
