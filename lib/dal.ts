"use server";
import "server-only";

import { BaseCardParams, Embed, TextCard } from "@/lib/discord/schema";
import { cache } from "react";
import { getUser, getUserByAccessToken, getUserGuild, getUserGuilds, getUserGuildsByAccessToken } from "./discord/user";
import prisma from "./prisma";

import { decrypt, getSession } from "@/lib/session";
import { ModuleName, SessionPayload } from "@/types";
import { Leaver, Period, Prisma, Welcomer } from "@prisma/client";
import { getGuild } from "./discord/guild";

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
    const user = await getUser(session.id);
    return user;
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


export const getGuilds = cache(async () => {
  try {
    let guilds = await getUserGuilds();
    if (!guilds) return null;

    guilds = guilds.filter((guild) => {
      return (guild.owner || (guild.permissions && ((Number(guild.permissions) & 0x20) === 0x20)));
    });

    await Promise.all(guilds.map(async (guild) => {
      const botGuild = await getGuild(guild.id);
      await guild.setMutual(!!botGuild);
    }));
    return guilds;
  } catch {
    return null;
  }
});


export async function getWelcomer(guildId: string) {
  try {
    if (!(await canUserManageGuild(guildId))) return null;
    const welcomer = await prisma.welcomer.findUnique({
      where: { guildId: guildId },
      include: {
        activeCard: {
          include: {
            mainText: true,
            secondText: true,
            nicknameText: true,
          },
        },
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
  } catch {
    return null;
  }
}

export async function getLeaver(guildId: string): Promise<Leaver | null> {
  try {
    if (!(await canUserManageGuild(guildId))) return null;
    const leaver = await prisma.leaver.findUnique({
      where: { guildId },
      include: {
        activeCard: {
          include: {
            mainText: true,
            secondText: true,
            nicknameText: true,
          },
        },
        embeds: {
          include: {
            fields: true,
            author: true,
            footer: true,
          },
        },
      },
    });

    return leaver;
  } catch {
    return null;
  }
}


export async function getEmbeds(
  moduleId: string,
  module: ModuleName
): Promise<Embed[] | null> {
  try {
    moduleId = moduleId
    const welcomerModule = await getWelcomer(moduleId);
    if (!welcomerModule?.guildId) return null;

    if (!(await canUserManageGuild(welcomerModule?.guildId))) return null;

    const embeds: Embed[] = await prisma.embed.findMany({
      where: {
        [`${module}Id`]: moduleId,
      },
    });

    return embeds;
  } catch {
    return null;
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

export async function getModuleCards(
  moduleId: string,
  module: "welcomer" | "leaver"
): Promise<BaseCardParams[] | null> {
  try {
    const cards = await prisma.imageCard.findMany({
      where: { [module + "Id"]: moduleId },
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
  module: ModuleName
) {
  return await prisma.guildStats.findFirst({
    where: {
      guildId,
      period,
      module,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
export async function createGuildStats(
  guildId: string,
  period: Period,
  module: ModuleName,
) {
  const latestStats = await getLatestGuildStats(guildId, period, module);

  if (!latestStats) {
    return await prisma.guildStats.create({
      data: {
        guildId,
        period,
        module,
        createdAt: new Date(),
      },
    });
  }
}

export async function createModuleStats(guildId: string, module: ModuleName) {
  Object.values(Period).forEach(async (period) => {
    await createGuildStats(guildId, period, module);
  });
}

export async function createWelcomer(guildId: string) {
  const welcomer = await prisma.welcomer.create({
    data: {
      guildId,
    },
  });
  await createModuleStats(guildId, "welcomer");
  return welcomer;
}

export async function createLeaver(guildId: string) {
  const leaver = await prisma.leaver.create({
    data: {
      guildId,
    },
  });
  await createModuleStats(guildId, "leaver");
  return leaver;
}

export async function updateWelcomer(
  guildId: string,
  data: Prisma.XOR<
    Prisma.WelcomerUpdateInput,
    Prisma.WelcomerUncheckedUpdateInput
  >
) {
  return await prisma.welcomer.update({
    where: {
      guildId: guildId,
    },
    data,
  });
}

export async function updateWelcomerChannelAndContent(
  guildId: string,
  channelId: string,
  content: string | null | undefined
) {
  const data: Partial<Welcomer> = {
    channelId,
    content,
  };
  return updateWelcomer(guildId, data);
}

export async function updateLeaver(
  guildId: string,
  data: Prisma.XOR<Prisma.LeaverUpdateInput, Prisma.LeaverUncheckedUpdateInput>
) {
  return await prisma.leaver.update({
    where: {
      guildId: guildId,
    },
    data,
  });
}
export async function updateLeaverChannelAndContent(
  guildId: string,
  channelId: string,
  content: string | null | undefined
) {
  const data: Partial<Leaver> = {
    channelId,
    content,
  };
  return updateLeaver(guildId, data);
}

const includeAllEmbeds: Prisma.EmbedInclude = {
  author: true,
  footer: true,
  fields: true,
  image: true,
  DM: true,
};

export async function deleteEmbed(
  embedId: number,
  moduleName: ModuleName,
  moduleId: string
) {
  return await prisma.embed.delete({
    where: {
      id: embedId,
      [`${moduleName}Id`]: moduleId,
    },
    include: includeAllEmbeds,
  });
}

export async function updateEmbed(
  embedId: number,
  moduleName: ModuleName,
  moduleId: string,
  data: Prisma.XOR<Prisma.EmbedUpdateInput, Prisma.EmbedUncheckedUpdateInput>
) {
  return await prisma.embed.update({
    where: {
      id: embedId,
      [`${moduleName}Id`]: moduleId,
    },
    data,
    include: includeAllEmbeds,
  });
}

export async function createEmbed(
  data: Prisma.XOR<Prisma.EmbedCreateInput, Prisma.EmbedUncheckedCreateInput>
) {
  return await prisma.embed.create({
    data,
    include: includeAllEmbeds,
  });
}

export async function deleteEmbedField(fieldId: number) {
  return await prisma.embedField.delete({
    where: {
      id: fieldId,
    },
  });
}

export async function deleteWelcomer(guildId: string) {
  return await prisma.welcomer.delete({
    where: {
      guildId,
    },
  });
}

export async function deleteLeaver(guildId: string) {
  return await prisma.leaver.delete({
    where: {
      guildId,
    },
  });
}

export async function deleteCard(cardId: number) {
  return await prisma.imageCard.delete({
    where: {
      id: cardId,
    },
  });
}

export async function deleteCardText(textId: number) {
  return await prisma.imageCardText.delete({
    where: {
      id: textId,
    },
  });
}

export async function updateImageCardText(textId: number, text: TextCard) {
  return await prisma.imageCardText.update({
    where: {
      id: textId,
    },
    data: {
      content: text.content,
      color: text.color,
      font: text.font,
    },
  });
}

export async function updateImageCard(
  cardId: number,
  data: Prisma.XOR<
    Prisma.ImageCardUpdateInput,
    Prisma.ImageCardUncheckedUpdateInput
  >
) {
  return await prisma.imageCard.update({
    where: {
      id: cardId,
    },
    data,
    include: {
      mainText: true,
      secondText: true,
      nicknameText: true,
    },
  });
}

export async function createImageCard(
  data: Prisma.XOR<
    Prisma.ImageCardCreateInput,
    Prisma.ImageCardUncheckedCreateInput
  >
) {
  return await prisma.imageCard.create({
    data,
    include: {
      mainText: true,
      secondText: true,
      nicknameText: true,
    },
  });
}


export async function getGuildBeta(guildId: string) {
  return await prisma.betaGuild.findUnique({
    where: {
      id: guildId
    }
  })
}

export async function addGuildToBeta(guildId: string) {
  try {

    return await prisma.betaGuild.create({
      data: {
        id: guildId
      },
    })
  } catch {
    return false;
  }
}

export async function removeGuildToBeta(guildId: string) {
  try {

    return await prisma.betaGuild.delete({
      where: {
        id: guildId
      }
    })
  } catch {
    return false;
  }
}

export async function getAllGuildStatsSinceTime(guildId: string,
  period: Period,
  module: ModuleName,
  since: Date
) {
  return await prisma.guildStats.findMany({
    where: {
      guildId,
      period,
      module,
      createdAt: {
        gte: since
      }
    }
  })
}

export async function getSessionData() {
  const session = await verifySession();
  if (!session) return null;
  return await prisma.session.findUnique({
    where: {
      id: session.id
    }
  })
}


export async function getUsers() {
  return await prisma.user.findMany();
}

export async function getUserBaseData(id: string) {
  return await prisma.user.findUnique({
    where: {
      id: id
    }
  })
}

export async function getSessionDataById(id: string) {
  return await prisma.session.findFirst({
    where: {
      userId: id
    }
  })
}

export async function getUserData(id: string) {
  const data = await getSessionDataById(id);
  if (!data) return null;
  const user = await getUserByAccessToken(data.accessToken)
  if (!user) return null;
  return user.toObject();
}

export async function getGuildsByUserId(userId: string) {
  console.log(userId)
  try {
    const data = await getSessionDataById(userId);
    if (!data) return null;
    let guilds = await getUserGuildsByAccessToken(data.accessToken)
    if (!guilds) return null;

    guilds = guilds.filter((guild) => {
      return (guild.owner || (guild.permissions && ((Number(guild.permissions) & 0x20) === 0x20)));
    });

    await Promise.all(guilds.map(async (guild) => {
      const botGuild = await getGuild(guild.id);
      await guild.setMutual(!!botGuild);
    }));
    return guilds.map(guild => guild.toObject());
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
  })
  return dbSession;
}