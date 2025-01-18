"use server";
import "server-only";

import { Embed } from "@/lib/discord/schema";
import {
  APIChannel,
  RESTGetAPIGuildChannelsResult,
} from "discord-api-types/v10";
import { cache } from "react";

import prisma from "./prisma";

import { decrypt, getSession } from "@/lib/session";
import { GuildExtended } from "@/types";
import { Leaver, Welcomer } from "@prisma/client";



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
    return await prisma.userGuild.findMany({
      where: { userId: session.userId },
    });
  } catch {
    return null;
  }
});

export const getUserGuild = cache(async (guildId: string) => {
  const session = await verifySession();

  if (!session) return null;

  try {
    return await prisma.userGuild.findFirst({
      where: { userId: session.userId, id: guildId },
    });
  } catch (e){
    console.log("Failed to get user guild",e );
    return null;
  }
});

export const getGuilds = cache(async () => {
  try {
    const session = await verifySession();

    if (!session) return null;

    const userGuilds = await getUserGuilds();

    if (!userGuilds) return null;

    return await Promise.all(
      userGuilds.map(async (userGuild: GuildExtended) => {
        const guild = await prisma.guild.findUnique({
          where: { id: userGuild.id },
        });

        if (guild) {
          userGuild.mutual = true;
        }

        return userGuild;
      })
    );
  } catch {
    return null;
  }
});

export async function getGuild(guildId: string) {
  try {
    if (!(await canUserManageGuild(guildId))) return null;
    return await prisma.guild.findUnique({
      where: { id: guildId },
    });
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

export async function getWelcomer(guildId: string): Promise<Welcomer | null> {
  try {
    if (!(await canUserManageGuild(guildId))) return null;
    const welcomer = await prisma.welcomer.findUnique({
      where: { guildId: guildId },
      include: {
        embeds: {
          include: {
            fields: true,
            author: true,
            footer: true,
          },
        },
        DM: true,
      },
    });

    return welcomer;
  } catch(e) {
    return null;
  }
}

export async function getLeaver(guildId: string): Promise<Leaver | null> {
  try {
    if (!(await canUserManageGuild(guildId))) return null;
    const leaver = await prisma.leaver.findUnique({
      where: { guildId },
      include: {
        embeds: {
          include: {
            fields: true,
            author: true,
            footer: true,
            image: true,
          },
        },
      },
    });

    return leaver;
  } catch {
    return null;
  }
}

export async function getWelcomerById(welcomerId: number) {
  try {
    const welcomer = await prisma.welcomer.findUnique({
      where: { id: welcomerId },
    });

    return welcomer;
  } catch {
    return null;
  }
}


export async function getLeaverById(leaverId: number) {
  try {
    const leaver = await prisma.leaver.findUnique({
      where: { id: leaverId },
    });

    return leaver;
  } catch {
    return null;
  }
}

export async function getEmbeds(
  moduleId: string | number
): Promise<Embed[] | null> {
  try {
    moduleId = Number(moduleId);
    const welcomerModule = await getWelcomerById(moduleId);
    if (!welcomerModule) return null;

    if (!(await canUserManageGuild(welcomerModule?.guildId))) return null;

    const embeds: Embed[] = await prisma.embed.findMany({
      where: {
        OR: [{ welcomerId: moduleId }, { leaverId: moduleId }],
      },
    });

    return embeds;
  } catch {
    return null;
  }
}

export async function getGuildChannels(guildId: string): Promise<APIChannel[]> {
  // get guild channels from discord api
  try {
    if (!(await canUserManageGuild(guildId)))
      throw new Error("You do not have permission to manage this guild");
    const data = await fetch(
      "https://discord.com/api/guilds/" + guildId + "/channels",
      {
        headers: {
          authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
        next: {
          revalidate: 60,
        },
      }
    );

    const channels: RESTGetAPIGuildChannelsResult = await data.json();

    return channels;
  } catch {
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
