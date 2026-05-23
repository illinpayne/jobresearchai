-- AlterTable
ALTER TABLE "bundles" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "plans" ADD COLUMN     "annual_price" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "benefits" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "monthly_price" INTEGER NOT NULL DEFAULT 0;
