-- DropForeignKey
ALTER TABLE "Leaver" DROP CONSTRAINT "Leaver_activeCardId_fkey";

-- DropForeignKey
ALTER TABLE "Leaver" DROP CONSTRAINT "Leaver_activeCardToEmbedId_fkey";

-- DropForeignKey
ALTER TABLE "Leaver" DROP CONSTRAINT "Leaver_guildId_fkey";

-- DropForeignKey
ALTER TABLE "Welcomer" DROP CONSTRAINT "Welcomer_activeCardId_fkey";

-- DropForeignKey
ALTER TABLE "Welcomer" DROP CONSTRAINT "Welcomer_activeCardToEmbedId_fkey";

-- DropForeignKey
ALTER TABLE "Welcomer" DROP CONSTRAINT "Welcomer_guildId_fkey";

-- AddForeignKey
ALTER TABLE "Welcomer" ADD CONSTRAINT "Welcomer_activeCardToEmbedId_fkey" FOREIGN KEY ("activeCardToEmbedId") REFERENCES "Embed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Welcomer" ADD CONSTRAINT "Welcomer_activeCardId_fkey" FOREIGN KEY ("activeCardId") REFERENCES "ImageCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Welcomer" ADD CONSTRAINT "Welcomer_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaver" ADD CONSTRAINT "Leaver_activeCardToEmbedId_fkey" FOREIGN KEY ("activeCardToEmbedId") REFERENCES "Embed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaver" ADD CONSTRAINT "Leaver_activeCardId_fkey" FOREIGN KEY ("activeCardId") REFERENCES "ImageCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaver" ADD CONSTRAINT "Leaver_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
