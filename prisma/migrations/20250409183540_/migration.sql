/*
  Warnings:

  - The primary key for the `DM` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `moduleId` on the `DM` table. All the data in the column will be lost.
  - You are about to drop the column `banner` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `memberCount` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `permissions` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `premium` on the `Guild` table. All the data in the column will be lost.
  - The primary key for the `Leaver` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Leaver` table. All the data in the column will be lost.
  - You are about to drop the column `accessToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `discriminator` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `User` table. All the data in the column will be lost.
  - The primary key for the `Welcomer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Welcomer` table. All the data in the column will be lost.
  - You are about to drop the `BotGuild` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Channels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserToGuild` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `guildId` on table `Leaver` required. This step will fail if there are existing NULL values in that column.
  - Made the column `guildId` on table `Welcomer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "BotGuild" DROP CONSTRAINT "BotGuild_id_fkey";

-- DropForeignKey
ALTER TABLE "Channels" DROP CONSTRAINT "Channels_guildId_fkey";

-- DropForeignKey
ALTER TABLE "DM" DROP CONSTRAINT "DM_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "Embed" DROP CONSTRAINT "Embed_DMId_fkey";

-- DropForeignKey
ALTER TABLE "Embed" DROP CONSTRAINT "Embed_leaverId_fkey";

-- DropForeignKey
ALTER TABLE "Embed" DROP CONSTRAINT "Embed_welcomerId_fkey";

-- DropForeignKey
ALTER TABLE "ImageCard" DROP CONSTRAINT "ImageCard_leaverId_fkey";

-- DropForeignKey
ALTER TABLE "ImageCard" DROP CONSTRAINT "ImageCard_welcomerId_fkey";

-- DropForeignKey
ALTER TABLE "Leaver" DROP CONSTRAINT "Leaver_guildId_fkey";

-- DropForeignKey
ALTER TABLE "Welcomer" DROP CONSTRAINT "Welcomer_guildId_fkey";

-- DropForeignKey
ALTER TABLE "_UserToGuild" DROP CONSTRAINT "_UserToGuild_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToGuild" DROP CONSTRAINT "_UserToGuild_B_fkey";

-- DropIndex
DROP INDEX "DM_moduleId_key";

-- DropIndex
DROP INDEX "Guild_id_key";

-- DropIndex
DROP INDEX "Leaver_guildId_key";

-- DropIndex
DROP INDEX "Welcomer_guildId_key";

-- AlterTable
ALTER TABLE "DM" DROP CONSTRAINT "DM_pkey",
DROP COLUMN "moduleId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "DM_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "DM_id_seq";

-- AlterTable
ALTER TABLE "Embed" ALTER COLUMN "welcomerId" SET DATA TYPE TEXT,
ALTER COLUMN "leaverId" SET DATA TYPE TEXT,
ALTER COLUMN "DMId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Guild" DROP COLUMN "banner",
DROP COLUMN "description",
DROP COLUMN "icon",
DROP COLUMN "memberCount",
DROP COLUMN "name",
DROP COLUMN "permissions",
DROP COLUMN "premium",
ADD COLUMN     "leaverguildId" TEXT,
ADD COLUMN     "welcomerguildId" TEXT;

-- AlterTable
ALTER TABLE "ImageCard" ALTER COLUMN "welcomerId" SET DATA TYPE TEXT,
ALTER COLUMN "leaverId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Leaver" DROP CONSTRAINT "Leaver_pkey",
DROP COLUMN "id",
ALTER COLUMN "guildId" SET NOT NULL,
ADD CONSTRAINT "Leaver_pkey" PRIMARY KEY ("guildId");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "accessToken",
DROP COLUMN "avatar",
DROP COLUMN "discriminator",
DROP COLUMN "refreshToken";

-- AlterTable
ALTER TABLE "Welcomer" DROP CONSTRAINT "Welcomer_pkey",
DROP COLUMN "id",
ALTER COLUMN "guildId" SET NOT NULL,
ADD CONSTRAINT "Welcomer_pkey" PRIMARY KEY ("guildId");

-- DropTable
DROP TABLE "BotGuild";

-- DropTable
DROP TABLE "Channels";

-- DropTable
DROP TABLE "_UserToGuild";

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "premiumGuild" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "premiumGuild_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DM" ADD CONSTRAINT "DM_id_fkey" FOREIGN KEY ("id") REFERENCES "Welcomer"("guildId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Embed" ADD CONSTRAINT "Embed_DMId_fkey" FOREIGN KEY ("DMId") REFERENCES "DM"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Embed" ADD CONSTRAINT "Embed_leaverId_fkey" FOREIGN KEY ("leaverId") REFERENCES "Leaver"("guildId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Embed" ADD CONSTRAINT "Embed_welcomerId_fkey" FOREIGN KEY ("welcomerId") REFERENCES "Welcomer"("guildId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageCard" ADD CONSTRAINT "ImageCard_leaverId_fkey" FOREIGN KEY ("leaverId") REFERENCES "Leaver"("guildId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageCard" ADD CONSTRAINT "ImageCard_welcomerId_fkey" FOREIGN KEY ("welcomerId") REFERENCES "Welcomer"("guildId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "premiumGuild" ADD CONSTRAINT "premiumGuild_id_fkey" FOREIGN KEY ("id") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guild" ADD CONSTRAINT "Guild_welcomerguildId_fkey" FOREIGN KEY ("welcomerguildId") REFERENCES "Welcomer"("guildId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guild" ADD CONSTRAINT "Guild_leaverguildId_fkey" FOREIGN KEY ("leaverguildId") REFERENCES "Leaver"("guildId") ON DELETE SET NULL ON UPDATE CASCADE;
