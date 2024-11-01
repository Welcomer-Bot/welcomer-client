import "server-only";

import {Leaver, Welcomer} from "@prisma/client";
import {APIChannel, RESTGetAPIGuildChannelsResult} from "discord-api-types/v10";
import {cache} from "react";

import prisma from "./prisma";

import {decrypt, getSession} from "@/lib/session";
import {GuildExtended} from "@/types";

export const verifySession = cache(async () => {
  const session = await getSession();
  const clientSession = await decrypt(session);

  if (!clientSession?.userId) {
    return null;
  }

  return { isAuth: true, userId: clientSession.userId as string };
});

export const getUser = cache(async () => {
  const session = await verifySession();

  if (!session) return null;
  try {
    const data = await prisma.user.findMany({
      where: { id: session.userId },
    });

    return data[0];
  } catch {
    return null;
  }
});

export const canUserManageGuild = cache(async (guildId: string) => {
  try {
    const guild = await getUserGuild(guildId);

    return !!guild;
  } catch {
    return false;
  }
});

export const getUserGuilds = cache(async () => {
  const session = await verifySession();

  if (!session) return null;

  try {
    const guilds = await prisma.userGuild.findMany({
      where: { userId: session.userId },
    });

    return guilds;
  } catch {
    return null;
  }
});

export const getUserGuild = cache(async (guildId: string) => {
  const session = await verifySession();

  if (!session) return null;

  try {
    const guild = await prisma.userGuild.findFirst({
      where: { userId: session.userId, id: guildId },
    });

    return guild;
  } catch {
    return null;
  }
});

export const getGuilds = cache(async () => {
  try {
    const session = await verifySession();

    if (!session) return null;

    const userGuilds = await getUserGuilds();

    if (!userGuilds) return null;

    const guilds = await Promise.all(
      userGuilds.map(async (userGuild: GuildExtended) => {
        const guild = await prisma.guild.findUnique({
          where: { id: userGuild.id },
        });

        if (guild) {
          userGuild.mutual = true;
        }

        return userGuild;
      }),
    );

    return guilds;
  } catch (error) {
    return null;
  }
});

export async function getGuild(guildId: string) {
  try {
    if (!canUserManageGuild(guildId)) return null;
    const guild = await prisma.guild.findUnique({
      where: { id: guildId },
    });

    return guild;
  } catch {
    return null;
  }
}

export async function getUserData() {
  const session = await verifySession();

  if (!session) return null;

  try {
    const data = await prisma.user.findMany({
      where: { id: session.userId },
    });
    const user = data[0];

    return user;
  } catch {
    return null;
  }
}

export async function getWelcomer(guildId: string) {
  try {
    if (!canUserManageGuild(guildId)) return null;
    const welcomer = await prisma.welcomer.findUnique({
      where: { guildId },
    });

    return welcomer;
  } catch {
    return null;
  }
}

export async function getEmbeds(module: Welcomer | Leaver) {
  try {
    if (!canUserManageGuild(module.guildId)) return null;

    const embeds = await prisma.embed.findMany({
      // make the resquest either on welcomerId or leaverId
      where: {
        OR: [{ welcomerId: module.id }, { leaverId: module.id }],
      },
      include: {
        author: true,
        fields: true,
        footer: true,
        image: true,
        thumbnail: true,
      },
    });

    return embeds;
  } catch {
    return [];
  }
}

export async function getGuildChannels(guildId: string): Promise<APIChannel[]> {
  // get guild channels from discord api
  try {
    if (!canUserManageGuild(guildId)) throw new Error("You do not have permission to manage this guild");
    const data = await fetch(
      "https://discord.com/api/guilds/" + guildId + "/channels",
      {
        headers: {
          authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
        next: {
          revalidate: 60,
        },
      },
    );

    const channels: RESTGetAPIGuildChannelsResult = await data.json();

    return channels;
  } catch (error) {
    throw new Error("Failed to fetch guild channels");
  }
}

export async function getEmbedAuthor(embedId: number) {
  try {
    const author = await prisma.embedAuthor.findUnique({
      where: { embedId: embedId },
    });

    return author;
  } catch {
    return null;
  }
}

export async function createEmbedAuthor(embedId: number, name: string) {
  try {
    const author = await prisma.embedAuthor.create({
      data: {
        embedId: embedId,
        name: name,
      },
    });

    return author;
  } catch {
    return null;
  }
}
