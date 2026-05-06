-- AlterTable
ALTER TABLE "customer_profiles" ADD COLUMN     "job_id" TEXT;

-- AddForeignKey
ALTER TABLE "customer_profiles" ADD CONSTRAINT "customer_profiles_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "ai_analyse_job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
