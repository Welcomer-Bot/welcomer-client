/*
  Warnings:

  - You are about to drop the column `id` on the `GuildStats` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "GuildStats_id_key";

-- AlterTable
ALTER TABLE "GuildStats" DROP COLUMN "id";
