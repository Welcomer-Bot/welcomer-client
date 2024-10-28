/*
  Warnings:

  - You are about to alter the column `title` on the `Embed` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `description` on the `Embed` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2048)`.
  - The `timestamp` column on the `Embed` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Embed" ALTER COLUMN "title" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(2048),
DROP COLUMN "timestamp",
ADD COLUMN     "timestamp" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "EmbedAuthor" ALTER COLUMN "name" DROP NOT NULL;
