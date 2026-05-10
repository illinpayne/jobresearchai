-- CreateIndex
CREATE INDEX "vacancies_position_idx" ON "vacancies"("position");

-- CreateIndex
CREATE INDEX "vacancies_location_idx" ON "vacancies"("location");

-- CreateIndex
CREATE INDEX "vacancies_salaryValueFrom_idx" ON "vacancies"("salaryValueFrom");

-- CreateIndex
CREATE INDEX "vacancies_salaryValueTo_idx" ON "vacancies"("salaryValueTo");

-- CreateIndex
CREATE INDEX "vacancies_created_at_idx" ON "vacancies"("created_at" DESC);
