/*
  Warnings:

  - You are about to drop the column `salary_from` on the `vacancies` table. All the data in the column will be lost.
  - You are about to drop the column `salary_to` on the `vacancies` table. All the data in the column will be lost.
  - You are about to drop the `user_accounts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `position` to the `vacancies` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_accounts" DROP CONSTRAINT "user_accounts_vacancyId_fkey";

-- AlterTable
ALTER TABLE "vacancies" DROP COLUMN "salary_from",
DROP COLUMN "salary_to",
ADD COLUMN     "position" TEXT NOT NULL,
ADD COLUMN     "salary" TEXT;

-- DropTable
DROP TABLE "user_accounts";

-- CreateTable
CREATE TABLE "user_vacancy" (
    "account_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "vacancyId" TEXT NOT NULL,

    CONSTRAINT "user_vacancy_pkey" PRIMARY KEY ("account_id","vacancyId")
);

-- AddForeignKey
ALTER TABLE "user_vacancy" ADD CONSTRAINT "user_vacancy_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES "vacancies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
