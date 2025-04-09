/*
  Warnings:

  - You are about to drop the column `leaverguildId` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `welcomerguildId` on the `Guild` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Guild" DROP CONSTRAINT "Guild_leaverguildId_fkey";

-- DropForeignKey
ALTER TABLE "Guild" DROP CONSTRAINT "Guild_welcomerguildId_fkey";

-- AlterTable
ALTER TABLE "Guild" DROP COLUMN "leaverguildId",
DROP COLUMN "welcomerguildId";

-- AddForeignKey
ALTER TABLE "Welcomer" ADD CONSTRAINT "Welcomer_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaver" ADD CONSTRAINT "Leaver_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
