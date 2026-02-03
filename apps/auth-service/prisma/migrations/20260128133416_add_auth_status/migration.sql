-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "is_auth_verified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "avatar" DROP NOT NULL;
