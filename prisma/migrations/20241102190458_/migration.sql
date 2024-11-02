-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Welcomer" (
    "id" SERIAL NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT,
    "content" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Leaver" (
    "id" SERIAL NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "DM" (
    "id" SERIAL NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Embed" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(256),
    "description" VARCHAR(2048),
    "color" INTEGER,
    "timestamp" TIMESTAMP(3),
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "welcomerId" INTEGER,
    "leaverId" INTEGER,
    "DMId" INTEGER,

    CONSTRAINT "Embed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmbedThumbnail" (
    "id" SERIAL NOT NULL,
    "embedId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER,
    "heigth" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmbedThumbnail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmbedImage" (
    "id" SERIAL NOT NULL,
    "embedId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER,
    "heigth" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmbedImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmbedAuthor" (
    "id" SERIAL NOT NULL,
    "embedId" INTEGER NOT NULL,
    "name" TEXT,
    "iconUrl" TEXT,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmbedAuthor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmbedField" (
    "id" SERIAL NOT NULL,
    "embedId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "inline" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmbedField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmbedFooter" (
    "id" SERIAL NOT NULL,
    "embedId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "iconUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmbedFooter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "discriminator" TEXT,
    "avatar" TEXT,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGuild" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "banner" TEXT,
    "permissions" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserGuild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channels" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Channels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guild_id_key" ON "Guild"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Welcomer_id_key" ON "Welcomer"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Welcomer_guildId_key" ON "Welcomer"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "Leaver_id_key" ON "Leaver"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Leaver_guildId_key" ON "Leaver"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "DM_id_key" ON "DM"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DM_moduleId_key" ON "DM"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "EmbedThumbnail_embedId_key" ON "EmbedThumbnail"("embedId");

-- CreateIndex
CREATE UNIQUE INDEX "EmbedImage_embedId_key" ON "EmbedImage"("embedId");

-- CreateIndex
CREATE UNIQUE INDEX "EmbedAuthor_embedId_key" ON "EmbedAuthor"("embedId");

-- CreateIndex
CREATE UNIQUE INDEX "EmbedField_embedId_key" ON "EmbedField"("embedId");

-- CreateIndex
CREATE UNIQUE INDEX "EmbedFooter_embedId_key" ON "EmbedFooter"("embedId");

-- AddForeignKey
ALTER TABLE "Welcomer" ADD CONSTRAINT "Welcomer_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaver" ADD CONSTRAINT "Leaver_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DM" ADD CONSTRAINT "DM_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Welcomer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Embed" ADD CONSTRAINT "Embed_welcomerId_fkey" FOREIGN KEY ("welcomerId") REFERENCES "Welcomer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Embed" ADD CONSTRAINT "Embed_leaverId_fkey" FOREIGN KEY ("leaverId") REFERENCES "Leaver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Embed" ADD CONSTRAINT "Embed_DMId_fkey" FOREIGN KEY ("DMId") REFERENCES "DM"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmbedThumbnail" ADD CONSTRAINT "EmbedThumbnail_embedId_fkey" FOREIGN KEY ("embedId") REFERENCES "Embed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmbedImage" ADD CONSTRAINT "EmbedImage_embedId_fkey" FOREIGN KEY ("embedId") REFERENCES "Embed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmbedAuthor" ADD CONSTRAINT "EmbedAuthor_embedId_fkey" FOREIGN KEY ("embedId") REFERENCES "Embed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmbedField" ADD CONSTRAINT "EmbedField_embedId_fkey" FOREIGN KEY ("embedId") REFERENCES "Embed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmbedFooter" ADD CONSTRAINT "EmbedFooter_embedId_fkey" FOREIGN KEY ("embedId") REFERENCES "Embed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGuild" ADD CONSTRAINT "UserGuild_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channels" ADD CONSTRAINT "Channels_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "UserGuild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
