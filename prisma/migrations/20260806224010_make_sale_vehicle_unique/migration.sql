/*
  Warnings:

  - A unique constraint covering the columns `[vehicleId]` on the table `Sale` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Sale_vehicleId_key" ON "Sale"("vehicleId");
