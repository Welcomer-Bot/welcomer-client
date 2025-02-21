/*
  Warnings:

  - The primary key for the `GuildStats` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "GuildStats" DROP CONSTRAINT "GuildStats_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "GuildStats_pkey" PRIMARY KEY ("guildId", "period", "module", "createdAt");

-- CreateTable
CREATE TABLE "betaGuild" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "betaGuild_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "betaGuild" ADD CONSTRAINT "betaGuild_id_fkey" FOREIGN KEY ("id") REFERENCES "UserGuild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
