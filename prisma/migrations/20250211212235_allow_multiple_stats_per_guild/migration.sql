/*
  Warnings:

  - The primary key for the `GuildStats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `guildId` on table `GuildStats` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Guild" DROP CONSTRAINT "Guild_guildStatsId_fkey";

-- AlterTable
ALTER TABLE "GuildStats" DROP CONSTRAINT "GuildStats_pkey",
ALTER COLUMN "guildId" SET NOT NULL,
ADD CONSTRAINT "GuildStats_pkey" PRIMARY KEY ("guildId", "period", "module");

-- AddForeignKey
ALTER TABLE "GuildStats" ADD CONSTRAINT "GuildStats_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
