"use server";
import "server-only";

import { BaseCardParams, Embed, TextCard } from "@/lib/discord/schema";
import { cache } from "react";

import prisma from "./prisma";

import { decrypt, getSession } from "@/lib/session";
import { GuildExtended, ModuleName } from "@/types";
import { Leaver, Period, Prisma, Welcomer } from "@prisma/client";

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
      where: {
        users: {
          some: { id: session.userId },
        },
      },
    });
  } catch {
    return null;
  }
});

export const getUserGuildsByUserId = cache(async (userId: string) => {
  const session = await verifySession();

  if (!session) return null;
  try {
    return await prisma.userGuild.findMany({
      where: {
        users: {
          some: { id: userId },
        },
      },
      include: {
        betaGuild: true,
      }
    });
  } catch {
    return null;
  }
});

export const getUsers = cache(async () => {
  try {
    return await prisma.user.findMany();
  } catch {
    return null;
  }
});

export const getUserById = cache(async (userId: string) => {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
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
      where: {
        id: guildId,
        users: {
          some: { id: session.userId },
        },
      },
    });
  } catch (e) {
    console.log("Failed to get user guild", e);
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

export async function getGuildsByUserId(userId: string) {
  try {
    const userGuilds = await getUserGuildsByUserId(userId);

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
}




export async function getGuild(guildId: string) {
  try {
    if (!(await canUserManageGuild(guildId))) return null;
    return await prisma.guild.findUnique({
      where: { id: guildId },
      include: {
        welcomer: true,
        leaver: true,
      },
    });
  } catch {
    return null;
  }
}

export async function getChannel(channelId: string) {
  try {
    const channel = await prisma.channels.findUnique({
      where: {
        id: channelId,
      },
    });
    return channel;
  } catch (error) {
    console.log(error);
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
  moduleId: string | number,
  module: ModuleName
): Promise<Embed[] | null> {
  try {
    moduleId = Number(moduleId);
    const welcomerModule = await getWelcomerById(moduleId);
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

export async function getGuildChannels(guildId: string) {
  // get guild channels from discord api
  try {
    const res = await fetch(
      process.env.INTERNAL_API_BASE_URL + `/channels?guildId=${guildId}`,
      {
        headers: {
          Authorization: `${process.env.SERVER_TOKEN}`,
        },
      }
    );
    const data = await res.json();
    console.log(data)
    return data;
  } catch (err) {
    console.log(err)
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

export async function getModuleCards(
  moduleId: number,
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
  moduleId: number
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
  moduleId: number,
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


export async function addGuildToBeta(guildId: string) {
  return await prisma.betaGuild.create({
    data: {
      id: guildId
    },
  })
}

export async function removeGuildToBeta(guildId: string) {
  return await prisma.betaGuild.delete({
    where: {
      id: guildId
   }
  })
}