/*
  Warnings:

  - A unique constraint covering the columns `[activeCardToEmbedId]` on the table `Leaver` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[activeCardToEmbedId]` on the table `Welcomer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Leaver" ADD COLUMN     "activeCardToEmbedId" INTEGER;

-- AlterTable
ALTER TABLE "Welcomer" ADD COLUMN     "activeCardToEmbedId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Leaver_activeCardToEmbedId_key" ON "Leaver"("activeCardToEmbedId");

-- CreateIndex
CREATE UNIQUE INDEX "Welcomer_activeCardToEmbedId_key" ON "Welcomer"("activeCardToEmbedId");

-- AddForeignKey
ALTER TABLE "Welcomer" ADD CONSTRAINT "Welcomer_activeCardToEmbedId_fkey" FOREIGN KEY ("activeCardToEmbedId") REFERENCES "Embed"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaver" ADD CONSTRAINT "Leaver_activeCardToEmbedId_fkey" FOREIGN KEY ("activeCardToEmbedId") REFERENCES "Embed"("id") ON DELETE SET NULL ON UPDATE CASCADE;
