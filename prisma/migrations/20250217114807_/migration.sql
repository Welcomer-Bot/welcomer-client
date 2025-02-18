/*
  Warnings:

  - You are about to drop the column `channelId` on the `Channels` table. All the data in the column will be lost.
  - You are about to drop the column `guildStatsId` on the `Guild` table. All the data in the column will be lost.
  - Changed the type of `type` on the `Channels` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "Guild_guildStatsId_key";

-- DropIndex
DROP INDEX "GuildStats_guildId_key";

-- AlterTable
ALTER TABLE "Channels" DROP COLUMN "channelId",
DROP COLUMN "type",
ADD COLUMN     "type" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Guild" DROP COLUMN "guildStatsId";
