/*
  Warnings:

  - A unique constraint covering the columns `[DMId]` on the table `Embed` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Embed_DMId_key" ON "Embed"("DMId");
