"use server";
import "server-only";

import { BaseCardParams, Embed, TextCard } from "@/lib/discord/schema";
import { REST } from "@discordjs/rest";
import {
  type RESTError,
  RESTGetAPICurrentUserGuildsResult,
  RESTGetAPIGuildChannelsResult,
  RESTGetAPIGuildMemberResult,
  type RESTGetAPIGuildResult,
  RESTGetAPIGuildRolesResult,
  RESTGetAPIUserResult,
  Routes,
} from "discord-api-types/v10";
import { cache } from "react";

import prisma from "./prisma";

import { decrypt, getSession } from "@/lib/session";
import { SessionPayload } from "@/types";
import {
  EmbedField,
  ImageCard,
  ImageCardText,
  Period,
  Prisma,
  Source,
  SourceType,
} from "@prisma/client";
import Guild from "./discord/guild";
import rest from "./discord/rest";
import User from "./discord/user";

export const verifySession = cache(async (): Promise<SessionPayload | null> => {
  const session = await getSession();
  const clientSession = await decrypt(session);

  if (!clientSession?.id) {
    return null;
  }

  return clientSession;
});

export const fetchUserFromSession = cache(async () => {
  const session = await verifySession();
  if (!session) return null;
  try {
    const user = await getUser();
    return user;
  } catch {
    return null;
  }
});

export const getGuilds = cache(async () => {
  try {
    const guilds = await getUserGuilds();
    if (!guilds) return null;
    await Promise.all(
      guilds.map(async (guild) => {
        const botGuild = await getGuild(guild.id);
        await guild.setMutual(!!botGuild);
      })
    );
    return guilds;
  } catch {
    return null;
  }
});

export async function getSources(
  guildId: string,
  source: SourceType
): Promise<Source[] | null> {
  try {
    return await prisma.source.findMany({
      where: {
        guildId: guildId,
        type: source,
      },
      include: {
        embeds: {
          include: {
            fields: true,
            author: true,
            footer: true,
            image: true,
          },
        },
        activeCard: {
          include: {
            mainText: true,
            secondText: true,
            nicknameText: true,
          },
        },
        images: true,
        activeCardToEmbed: true,
      },
    });
  } catch {
    return null;
  }
}

export async function getSource(
  guildId: string,
  sourceId: number
): Promise<Source | null> {
  try {
    const source = await prisma.source.findFirst({
      where: {
        guildId: guildId,
        id: sourceId,
      },
      include: {
        embeds: {
          include: {
            fields: true,
            author: true,
            footer: true,
            image: true,
          },
        },
        activeCard: {
          include: {
            mainText: true,
            secondText: true,
            nicknameText: true,
          },
        },
        activeCardToEmbed: true,
      },
    });
    return source;
  } catch {
    return null;
  }
}

export async function getEmbeds(source: Source): Promise<Embed[] | null> {
  try {
    const embeds: Embed[] = await prisma.embed.findMany({
      where: {
        Source: source,
      },
    });

    return embeds;
  } catch {
    return null;
  }
}

export async function getEmbedAuthor(embed: Embed) {
  try {
    const author = await prisma.embedAuthor.findFirst({
      where: { embed: embed },
    });

    return author;
  } catch {
    return null;
  }
}

export async function createEmbedAuthor(embed: Embed, name: string) {
  try {
    const author = await prisma.embedAuthor.create({
      data: {
        name: name,
        embed: {
          connect: { id: embed.id },
        },
      },
    });

    return author;
  } catch {
    return null;
  }
}

export async function getSourceCards(
  sourceId: number
): Promise<BaseCardParams[] | null> {
  try {
    const cards = await prisma.imageCard.findMany({
      where: {
        sourceId: sourceId,
      },
      include: {
        mainText: true,
        secondText: true,
        nicknameText: true,
      },
    });

    return cards as BaseCardParams[];
  } catch {
    return null;
  }
}

export async function getLatestGuildStats(
  guildId: string,
  period: Period,
  source: SourceType
) {
  return await prisma.guildStats.findFirst({
    where: {
      Guild: {
        id: guildId,
      },
      period,
      source,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
export async function createGuildStats(
  guildId: string,
  period: Period,
  source: SourceType
) {
  const latestStats = await getLatestGuildStats(guildId, period, source);

  if (!latestStats) {
    return await prisma.guildStats.create({
      data: {
        Guild: {
          connectOrCreate: {
            where: { id: guildId },
            create: { id: guildId },
          },
        },
        period,
        source,
        createdAt: new Date(),
      },
    });
  }
}

export async function createModuleStats(guildId: string, source: SourceType) {
  Object.values(Period).forEach(async (period) => {
    await createGuildStats(guildId, period, source);
  });
}

const defaultWelcomerMessage = {
  content: "Welcome {user} to {guild}",
  embedTitle: "Welcome to the server!",
  embedDescription: "Welcome {user} to {guild}",
  embedFieldName: "New member count",
  embedFieldValue: "{membercount}",
  imageMainText: "Welcome {username} to the server!",
  imageSecondText: "You are the {membercount} member!",
  imageNicknameText: "{username}",
};

const defaultLeaverMessage = {
  content: "Goodbye {user} from {guild}",
  embedTitle: "Goodbye from the server",
  embedDescription: "Goodbye {user} from {guild}",
  embedFieldName: "Remaining member count",
  embedFieldValue: "{membercount}",
  imageMainText: "Goodbye {username} from the server",
  imageSecondText: "You left {membercount} member behind",
  imageNicknameText: "{username}",
};

export async function createSource(guildId: string, type: SourceType) {
  const message =
    type == "Welcomer" ? defaultWelcomerMessage : defaultLeaverMessage;
  const source = await prisma.source.create({
    data: {
      Guild: {
        connectOrCreate: {
          where: { id: guildId },
          create: { id: guildId },
        },
      },
      type: type,
      content: message.content,

      embeds: {
        create: [
          {
            title: message.embedTitle,
            description: message.embedDescription,
            fields: {
              create: [
                {
                  name: message.embedFieldName,
                  value: message.embedFieldValue,
                },
              ],
            },
          },
        ],
      },
    },
  });

  const updatedSource = await prisma.source.update({
    where: { id: source.id },
    data: {
      activeCard: {
        create: {
          mainText: {
            create: {
              content: message.imageMainText,
              color: "#ffffff",
              font: "Arial",
            },
          },
          secondText: {
            create: {
              content: message.imageSecondText,
              color: "#ffffff",
              font: "Arial",
            },
          },
          nicknameText: {
            create: {
              content: message.imageNicknameText,
              color: "#ffffff",
              font: "Arial",
            },
          },
          backgroundImgURL: "",
          Source: {
            connect: { id: source.id },
          },
        },
      },
    },
  });

  await createModuleStats(guildId, type);
  return updatedSource;
}

export async function deleteSource(guildId: string, sourceId: number) {
  return await prisma.source.delete({
    where: {
      guildId: guildId,
      id: sourceId,
    },
  });
}

export async function updateSourceQuery(
  source: Source,
  data: Prisma.XOR<Prisma.SourceUpdateInput, Prisma.SourceUncheckedUpdateInput>
) {
  return prisma.source.update({
    where: {
      id: source.id,
    },
    data,
  });
}

export async function updateSourceChannelAndContent(
  source: Source,
  channelId: string,
  content: string | null | undefined
) {
  const data: Partial<Source> = {
    channelId,
    content,
  };
  return updateSourceQuery(source, data);
}

export async function deleteEmbedQuery(embedId: number) {
  return prisma.embed.delete({
    where: {
      id: embedId,
    },
  });
}

export async function updateEmbedQuery(
  embed: Embed,
  data: Prisma.XOR<Prisma.EmbedUpdateInput, Prisma.EmbedUncheckedUpdateInput>
) {
  return prisma.embed.update({
    where: {
      id: embed.id,
    },
    data,
  });
}

export async function createEmbedQuery(
  data: Prisma.XOR<Prisma.EmbedCreateInput, Prisma.EmbedUncheckedCreateInput>
) {
  return prisma.embed.create({
    data,
  });
}

export async function deleteEmbedFieldQuery(field: EmbedField) {
  return prisma.embedField.delete({
    where: {
      id: field.id,
    },
  });
}

export async function deleteSourceQuery(source: Source) {
  return await prisma.source.delete({
    where: {
      id: source.id,
    },
  });
}

export async function deleteCardQuery(card: ImageCard) {
  return prisma.imageCard.delete({
    where: {
      id: card.id,
    },
  });
}

export async function deleteCardTextQuery(text: ImageCardText) {
  return prisma.imageCardText.delete({
    where: {
      id: text.id,
    },
  });
}

export async function updateImageCardTextQuery(
  textCard: ImageCardText,
  text: TextCard
) {
  return prisma.imageCardText.update({
    where: {
      id: textCard.id,
    },
    data: {
      content: text.content,
      color: text.color,
      font: text.font,
    },
  });
}

export async function updateImageCardQuery(
  card: ImageCard,
  data: Prisma.XOR<
    Prisma.ImageCardUpdateInput,
    Prisma.ImageCardUncheckedUpdateInput
  >
) {
  return prisma.imageCard.update({
    where: {
      id: card.id,
    },
    data,
  });
}

export async function createImageCardQuery(
  data: Prisma.XOR<
    Prisma.ImageCardCreateInput,
    Prisma.ImageCardUncheckedCreateInput
  >
) {
  return prisma.imageCard.create({
    data,
    include: {
      mainText: true,
      secondText: true,
      nicknameText: true,
    },
  });
}

export async function executeQueries(
  queries: Prisma.PrismaPromise<unknown>[]
): Promise<unknown[]> {
  return await prisma.$transaction(queries);
}

export async function getGuildBeta(guildId: string) {
  return await prisma.betaGuild.findFirst({
    where: { id: guildId },
  });
}

export async function addGuildToBeta(guildId: string, userId?: string) {
  try {
    return !!(await prisma.betaGuild.create({
      data: {
        guild: {
          connectOrCreate: {
            where: { id: guildId },
            create: { id: guildId },
          },
        },
        user: {
          connect: { id: userId || "" },
        }
      },
    }));
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function removeGuildToBeta(guildId: string) {
  try {
    return !!(await prisma.betaGuild.delete({
      where: {
        id: guildId,
      },
    }));
  } catch {
    return false;
  }
}

export async function getAllGuildStatsSinceTime(
  guildId: string,
  period: Period,
  source: SourceType,
  since: Date
) {
  return await prisma.guildStats.findMany({
    where: {
      guildId,
      period,
      source,
      createdAt: {
        gte: since,
      },
    },
  });
}

export async function getSessionData() {
  const session = await verifySession();
  if (!session) return null;
  return await prisma.session.findFirst({
    where: {
      id: session.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getUsers() {
  return await prisma.user.findMany();
}

export async function getUserBaseData(id: string) {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
}

export async function getSessionDataById(id: string) {
  return await prisma.session.findFirst({
    where: {
      userId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getUserDataById(id: string) {
  const data = await getSessionDataById(id);
  if (!data) return null;
  const user = await getUserByAccessToken(data.accessToken);
  if (!user) return null;
  return user.toObject();
}

export async function getUserData() {
  const data = await getSessionData();
  if (!data) return null;
  const user = await getUserByAccessToken(data.accessToken);
  if (!user) return null;
  return user.toObject();
}

export async function getGuildData(guildId: string) {
  const data = await getGuild(guildId);
  if (!data) return null;
  const guild = await getGuild(data.id);
  if (!guild) return null;
  return guild.toObject();
}

export async function getGuildsByUserId(userId: string) {
  try {
    const data = await getSessionDataById(userId);
    if (!data) return null;
    let guilds = await getUserGuildsByAccessToken(data.accessToken);
    if (!guilds) return null;

    guilds = guilds.filter((guild) => {
      return (
        guild.owner ||
        (guild.permissions && (Number(guild.permissions) & 0x20) === 0x20)
      );
    });

    await Promise.all(
      guilds.map(async (guild) => {
        const botGuild = await getGuild(guild.id);
        await guild.setMutual(!!botGuild);
      })
    );
    return guilds.map((guild) => guild.toObject());
  } catch {
    return null;
  }

  // const data = await getSessionDataById(userId);
  // if (!data) return null;
  // let guilds = await getUserGuildsByAccessToken(data.accessToken)
  // if (!guilds) return null;
  // guilds = guilds.filter((guild) => {
  //   return (guild.owner || (guild.permissions && ((Number(guild.permissions) & 0x20) === 0x20)));
  // });

  // return guilds.map(guild => guild.toObject());
}

export async function createDBSession(access_token: string, expires: number) {
  const user = await getUserByAccessToken(access_token);
  if (!user) {
    return null;
  }
  const dbSession = await prisma.session.create({
    data: {
      accessToken: access_token,
      expiresAt: new Date(Date.now() + expires * 1000),
      user: {
        connectOrCreate: {
          where: { id: user.id },
          create: { id: user.id, username: user.username },
        },
      },
    },
  });
  return dbSession;
}

export const getGuild = cache(async (guildId: string) => {
  try {
    const data = (await rest.get(
      `${Routes.guild(guildId)}?with_counts=true`
    )) as RESTGetAPIGuildResult | RESTError;
    if (!data || "message" in data) return null;

    const guild = new Guild(data);

    return guild;
  } catch {
    return null;
  }
});

export const leaveGuild = cache(async (guildId: string) => {
  try {
    const data = (await rest.delete(`${Routes.userGuild(guildId)}`)) as
      | RESTGetAPIGuildResult
      | RESTError;
    if (!data || "message" in data) return false;

    return !!data;
  } catch {
    return false;
  }
});

export const getChannels = cache(async (guildId: string) => {
  try {
    const data = (await rest.get(
      `${Routes.guildChannels(guildId)}?with_counts=true`
    )) as RESTGetAPIGuildChannelsResult | RESTError;
    if (!data || "message" in data) return null;

    return data;
  } catch {
    return null;
  }
});

export const getMemberPermissions = cache(async (guildId: string) => {
  try {
    const data = (await rest.get(
      Routes.guildMember(guildId, process.env.BOT_ID)
    )) as RESTGetAPIGuildResult | RESTError;
    if (!data || "message" in data) return null;
    console.log("member", data);
    return data;
  } catch (e) {
    console.error("Error fetching member permissions", e);
    return null;
  }
});

export const getRolesPermissions = cache(async (guildId: string) => {
  try {
    const data = (await rest.get(Routes.guildRoles(guildId))) as
      | RESTGetAPIGuildRolesResult
      | RESTError;
    if (!data || "message" in data) return null;
    return data;
  } catch {
    return null;
  }
});

export const getChannelData = cache(async (channelId: string) => {
  try {
    const data = (await rest.get(Routes.channel(channelId))) as
      | RESTGetAPIGuildChannelsResult
      | RESTError;
    if (!data || "message" in data) return null;
    return data;
  } catch {
    return null;
  }
});

export const getUser = cache(async () => {
  const sessionData = await getSessionData();
  if (!sessionData || !sessionData.accessToken) return null;
  return getUserByAccessToken(sessionData.accessToken);
});

export const getUserByAccessToken = cache(async (accessToken: string) => {
  const rest = new REST({ version: "10" }).setToken(accessToken);
  const data = (await rest.get(Routes.user(), {
    auth: true,
    authPrefix: "Bearer",
  })) as RESTGetAPIUserResult | RESTError;
  if (!data || "message" in data) return null;

  return new User(data);
});

export const getUserGuild = cache(async (guildId: string) => {
  const user = await getUser();
  if (!user) return null;
  if (user.id === "479216487173980160") return await getGuild(guildId);

  const userGuilds = await getUserGuilds();
  if (!userGuilds) return null;

  return userGuilds.find((guild) => guild.id === guildId) || null;
});

export const getUserGuilds = cache(async () => {
  const sessionData = await getSessionData();
  if (!sessionData || !sessionData.accessToken) return null;
  return getUserGuildsByAccessToken(sessionData.accessToken);
});

export const getUserGuildsByAccessToken = cache(async (accessToken: string) => {
  const rest = new REST({ version: "10" }).setToken(accessToken);
  const data = (await rest.get(`${Routes.userGuilds()}?with_counts=true`, {
    auth: true,
    authPrefix: "Bearer",
  })) as RESTGetAPICurrentUserGuildsResult | RESTError;
  if (!data || "message" in data) return null;
  const guilds = data.filter((guild) => {
    return (
      guild.owner ||
      (guild.permissions && (Number(guild.permissions) & 0x20) === 0x20)
    );
  });
  return guilds.map((guild) => new Guild(guild));
});

export const isPremiumGuild = cache(async (guildId: string) => {
  return !!(await prisma.premiumGuild.findUnique({
    where: {
      id: guildId,
    },
  }));
});

export const setPremiumGuild = cache(async (guildId: string) => {
  return await prisma.premiumGuild.create({
    data: {
      guild: {
        connectOrCreate: {
          where: { id: guildId },
          create: { id: guildId },
        },
      },
    },
  });
});

export const getBot = cache(async (guildId: string) => {
  const data = (await rest.get(
    Routes.guildMember(guildId, process.env.BOT_ID)
  )) as RESTGetAPIGuildMemberResult | RESTError;
  if (!data || "message" in data) return null;
  return data;
});

export const getBotGuilds = cache(async () => {
  const data = (await rest.get(`${Routes.userGuilds()}?with_counts=true`)) as
    | RESTGetAPICurrentUserGuildsResult
    | RESTError;
  if (!data || "message" in data) return null;
  return data.map((guild) => {
    const guildObj = new Guild(guild);
    guildObj.setMutual(true);
    return guildObj;
  });
}
);

export const getBetaTester = cache(async (guildId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      betaGuilds: {
        some: {
          id: guildId,
        },
      },
    },
  });
  if (!user?.id) {
    return null;
  }
  return getUserDataById(user.id);
});