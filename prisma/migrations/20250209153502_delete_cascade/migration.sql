-- DropForeignKey
ALTER TABLE "DM" DROP CONSTRAINT "DM_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "Embed" DROP CONSTRAINT "Embed_DMId_fkey";

-- DropForeignKey
ALTER TABLE "Embed" DROP CONSTRAINT "Embed_leaverId_fkey";

-- DropForeignKey
ALTER TABLE "Embed" DROP CONSTRAINT "Embed_welcomerId_fkey";

-- DropForeignKey
ALTER TABLE "EmbedAuthor" DROP CONSTRAINT "EmbedAuthor_embedId_fkey";

-- DropForeignKey
ALTER TABLE "EmbedField" DROP CONSTRAINT "EmbedField_embedId_fkey";

-- DropForeignKey
ALTER TABLE "EmbedFooter" DROP CONSTRAINT "EmbedFooter_embedId_fkey";

-- DropForeignKey
ALTER TABLE "EmbedImage" DROP CONSTRAINT "EmbedImage_embedId_fkey";

-- DropForeignKey
ALTER TABLE "ImageCard" DROP CONSTRAINT "ImageCard_leaverId_fkey";

-- DropForeignKey
ALTER TABLE "ImageCard" DROP CONSTRAINT "ImageCard_mainTextId_fkey";

-- DropForeignKey
ALTER TABLE "ImageCard" DROP CONSTRAINT "ImageCard_nicknameTextId_fkey";

-- DropForeignKey
ALTER TABLE "ImageCard" DROP CONSTRAINT "ImageCard_secondTextId_fkey";

-- DropForeignKey
ALTER TABLE "ImageCard" DROP CONSTRAINT "ImageCard_welcomerId_fkey";

-- AddForeignKey
ALTER TABLE "DM" ADD CONSTRAINT "DM_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Welcomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Embed" ADD CONSTRAINT "Embed_DMId_fkey" FOREIGN KEY ("DMId") REFERENCES "DM"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Embed" ADD CONSTRAINT "Embed_leaverId_fkey" FOREIGN KEY ("leaverId") REFERENCES "Leaver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Embed" ADD CONSTRAINT "Embed_welcomerId_fkey" FOREIGN KEY ("welcomerId") REFERENCES "Welcomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmbedImage" ADD CONSTRAINT "EmbedImage_embedId_fkey" FOREIGN KEY ("embedId") REFERENCES "Embed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmbedAuthor" ADD CONSTRAINT "EmbedAuthor_embedId_fkey" FOREIGN KEY ("embedId") REFERENCES "Embed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmbedField" ADD CONSTRAINT "EmbedField_embedId_fkey" FOREIGN KEY ("embedId") REFERENCES "Embed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmbedFooter" ADD CONSTRAINT "EmbedFooter_embedId_fkey" FOREIGN KEY ("embedId") REFERENCES "Embed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageCard" ADD CONSTRAINT "ImageCard_leaverId_fkey" FOREIGN KEY ("leaverId") REFERENCES "Leaver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageCard" ADD CONSTRAINT "ImageCard_welcomerId_fkey" FOREIGN KEY ("welcomerId") REFERENCES "Welcomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageCard" ADD CONSTRAINT "ImageCard_mainTextId_fkey" FOREIGN KEY ("mainTextId") REFERENCES "ImageCardText"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageCard" ADD CONSTRAINT "ImageCard_secondTextId_fkey" FOREIGN KEY ("secondTextId") REFERENCES "ImageCardText"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageCard" ADD CONSTRAINT "ImageCard_nicknameTextId_fkey" FOREIGN KEY ("nicknameTextId") REFERENCES "ImageCardText"("id") ON DELETE CASCADE ON UPDATE CASCADE;
