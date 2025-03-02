/*
  Warnings:

  - The primary key for the `GuildStats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `UserGuild` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserToUserGuild` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Guild` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Channels" DROP CONSTRAINT "Channels_guildId_fkey";

-- DropForeignKey
ALTER TABLE "GuildStats" DROP CONSTRAINT "GuildStats_guildId_fkey";

-- DropForeignKey
ALTER TABLE "_UserToUserGuild" DROP CONSTRAINT "_UserToUserGuild_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToUserGuild" DROP CONSTRAINT "_UserToUserGuild_B_fkey";

-- DropForeignKey
ALTER TABLE "betaGuild" DROP CONSTRAINT "betaGuild_id_fkey";

-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "banner" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "memberCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "permissions" TEXT;

-- AlterTable
ALTER TABLE "GuildStats" DROP CONSTRAINT "GuildStats_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "guildId" DROP NOT NULL,
ADD CONSTRAINT "GuildStats_pkey" PRIMARY KEY ("id", "period", "module", "createdAt");

-- DropTable
DROP TABLE "UserGuild";

-- DropTable
DROP TABLE "_UserToUserGuild";

-- CreateTable
CREATE TABLE "_UserToGuild" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserToGuild_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserToGuild_B_index" ON "_UserToGuild"("B");

-- AddForeignKey
ALTER TABLE "Guild" ADD CONSTRAINT "Guild_id_fkey" FOREIGN KEY ("id") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildStats" ADD CONSTRAINT "GuildStats_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "betaGuild" ADD CONSTRAINT "betaGuild_id_fkey" FOREIGN KEY ("id") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channels" ADD CONSTRAINT "Channels_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToGuild" ADD CONSTRAINT "_UserToGuild_A_fkey" FOREIGN KEY ("A") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToGuild" ADD CONSTRAINT "_UserToGuild_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
