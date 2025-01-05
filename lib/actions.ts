"use server";

import { redirect } from "next/navigation";
import prisma from "./prisma";

import { CompleteEmbed } from "@/prisma/schema";
import { WelcomerStore } from "@/state/welcomer";
import { ModuleName } from "@/types";
import { Welcomer } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { canUserManageGuild } from "./dal";
import { deleteSession } from "./session";
import { MessageSchema } from "./validator";
import { LeaverStore } from "@/state/leaver";

export async function signIn() {
  redirect("/api/auth/login");
}

export async function signOut() {
  await deleteSession();
  redirect("/");
}

export async function createModule(
  guildId: string,
  moduleName: ModuleName
): Promise<Welcomer> {
  if (!guildId || !(await canUserManageGuild(guildId))) {
    throw new Error("You do not have permission to manage this guild");
  }
  let res;
  if (moduleName === "welcomer") {
    res = await prisma.welcomer.create({
      data: {
        guildId: guildId,
      },
    });
  } else if (moduleName === "leaver") {
    res = await prisma.leaver.create({
      data: {
        guildId: guildId,
      },
    });
  } else {
    throw new Error("Invalid module name");
  }

  revalidatePath(`/app/dashboard/${guildId}/welcome`);

  return res;
}

export async function updateModule(store: WelcomerStore|LeaverStore, moduleName: ModuleName) {
  try {
    const guildId = store.guildId;
    if (!guildId || !(await canUserManageGuild(guildId))) {
      return {
        error: "You do not have permission to manage this guild",
      };
    }
    if (!store.channelId) {
      return {
        error: "You need to select a channel",
      };
    }
    const messageValidated = MessageSchema.safeParse(store);
    if (!messageValidated.success) {
      return {
        error: messageValidated.error.errors[0].path[-1]
          ? messageValidated.error.errors[0].path[-1] + ": "
          : "" + messageValidated.error.errors[0].message,
      };
    }
    let module;
    if (moduleName === "welcomer") {
      module = await prisma.welcomer.update({
        where: {
          guildId: guildId,
        },
        data: {
          channelId: store.channelId,
          content: store.content,
        },
      });
    } else if (moduleName === "leaver") {
      module = await prisma.leaver.update({
        where: {
          guildId: guildId,
        },
        data: {
          channelId: store.channelId,
          content: store.content,
        },
      });
    } else {
      return {
        error: "Invalid module name",
      };
    }

    for (const embed of store.embeds) {
      if (embed.id && embed[`${moduleName}Id`] && module.id != embed[`${moduleName}Id`])
        return {
          error: "You cannot update an embed that is not in the module",
        };
      const embedUpdated = await createOrUpdateEmbed(
        embed,
        module.id,
        moduleName
      );
      if (!embedUpdated) {
        return {
          error: "An error occurred while updating the module",
        };
      }
      store.embeds[store.embeds.indexOf(embed)] = embedUpdated;
    }
    for (const embed of store.deletedEmbeds) {
      if (embed.id) {
        if (embed[`${moduleName}Id`] && module.id != embed[`${moduleName}Id`])
          return {
            error: "You cannot delete an embed that is not in the module",
          };
        await prisma.embed.delete({
          where: {
            id: embed.id,
          [`${moduleName}Id`]: module.id,
          },
          include: {
            author: true,
            footer: true,
            fields: true,
            image: true,
          },
        });
      }
    }
    for (const field of store.deletedFields) {
      if (field.id) {
        if (field.embedId && !(field.embedId in store.embeds))
          return {
            error: "You cannot delete a field that is not in the embed",
          };
        await prisma.embedField.delete({
          where: {
            id: field.id,
          },
        });
      }
    }
    revalidatePath(`/app/dashboard/${guildId}/welcome`);

    return {
      done: true,
    };
  } catch (error) {
    console.log(error);
    revalidatePath(`/app/dashboard/${store.guildId}/welcome`);

    return {
      error: "An error occurred while updating the welcomer module",
    };
  }
}

export async function createOrUpdateEmbed(
  embed: CompleteEmbed,
  moduleId: number,
  moduleType: "welcomer" | "leaver"
): Promise<CompleteEmbed | null> {
  let embedDb;
  const createOrUpdateAuthor = {
    author: embed.author?.name
      ? {
          upsert: {
            where: {
              embedId: embed.id,
              [`${moduleType}Id`]: moduleId,
            },
            update: {
              name: embed.author?.name,
              iconUrl: embed.author?.iconUrl,
              url: embed.author?.url,
            },
            create: {
              id: embed.id,
              name: embed.author?.name,
              iconUrl: embed.author?.iconUrl,
              url: embed.author?.url,
            },
          },
        }
      : undefined,
  };

  const createOrUpdateFooter = {
    footer: embed.footer?.text
      ? {
          upsert: {
            where: {
              embedId: embed.id,
              [`${moduleType}Id`]: moduleId,
            },
            update: {
              text: embed.footer?.text,
              iconUrl: embed.footer?.iconUrl,
            },
            create: {
              id: embed.id,
              text: embed.footer?.text,
              iconUrl: embed.footer?.iconUrl,
            },
          },
        }
      : undefined,
  };

  const createOrUpdateFields = {
    fields: {
      upsert: embed.fields.map((field) => ({
        where: {
          embedId: embed.id,
          id: field.id ?? -1,
        },
        update: {
          name: field.name,
          value: field.value,
          inline: field.inline,
        },
        create: {
          name: field.name,
          value: field.value,
          inline: field.inline,
        },
      })),
    },
  };

  const createAuthor = {
    author: embed.author?.name
      ? {
          create: {
            name: embed.author?.name,
            iconUrl: embed.author?.iconUrl,
            url: embed.author?.url,
          },
        }
      : undefined,
  };

  const createFooter = {
    footer: embed.footer?.text
      ? {
          create: {
            text: embed.footer?.text,
            iconUrl: embed.footer?.iconUrl,
          },
        }
      : undefined,
  };

  const createFields = {
    fields: {
      create: embed.fields.map((field) => ({
        name: field.name,
        value: field.value,
        inline: field.inline,
      })),
    },
  };

  try {
    if (embed.id) {
      embedDb = await prisma.embed.update({
        where: {
          id: embed.id,
          [`${moduleType}Id`]: moduleId,
        },
        data: {
          title: embed.title,
          description: embed.description,
          color: embed.color,
          timestamp: embed.timestamp,
          ...createOrUpdateAuthor,
          ...createOrUpdateFooter,
          ...createOrUpdateFields,
        },
        include: {
          fields: true,
          author: true,
          footer: true,
        },
      });
    } else {
      embedDb = await prisma.embed.create({
        data: {
          [`${moduleType}Id`]: moduleId,
          title: embed.title,
          description: embed.description,
          color: embed.color,
          timestamp: embed.timestamp,
          ...createAuthor,
          ...createFooter,
          ...createFields,
        },
        include: {
          fields: true,
          author: true,
          footer: true,
        },
      });
    }
    return {
      ...embedDb,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function removeModule(
  guildId: string,
  moduleName: ModuleName
): Promise<boolean> {
  if (!(await canUserManageGuild(guildId))) {
    throw new Error("You do not have permission to manage this guild");
  }
  const embedsInclude = {
    embeds: {
      include: {
        fields: true,
        author: true,
        footer: true,
        image: true,
      },
    },
  };
  try {
    if (moduleName === "welcomer") {
      await prisma.welcomer.delete({
        where: {
          guildId: guildId,
        },
        include: {
          ...embedsInclude,
          DM: true,
        },
      });
    } else if (moduleName === "leaver") {
      await prisma.leaver.delete({
        where: {
          guildId: guildId,
        },
        include: {
          ...embedsInclude,
        },
      });
    } else {
      throw new Error("Invalid module name");
    }

    revalidatePath(`/app/dashboard/${guildId}/welcome`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
