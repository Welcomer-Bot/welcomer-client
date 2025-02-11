/*
  Warnings:

  - A unique constraint covering the columns `[guildStatsId]` on the table `Guild` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guildId]` on the table `GuildStats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `guildStatsId` to the `Guild` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GuildStats" DROP CONSTRAINT "GuildStats_id_fkey";

-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "guildStatsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GuildStats" ADD COLUMN     "guildId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Guild_guildStatsId_key" ON "Guild"("guildStatsId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildStats_guildId_key" ON "GuildStats"("guildId");

-- AddForeignKey
ALTER TABLE "Guild" ADD CONSTRAINT "Guild_guildStatsId_fkey" FOREIGN KEY ("guildStatsId") REFERENCES "GuildStats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
