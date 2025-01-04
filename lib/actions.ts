"use server";

import { redirect } from "next/navigation";
import prisma from "./prisma";

import { CompleteEmbed } from "@/prisma/schema";
import { WelcomerStore } from "@/state/welcomer";
import { Welcomer } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { canUserManageGuild } from "./dal";
import { deleteSession } from "./session";
import { MessageSchema } from "./validator";

export async function signIn() {
  redirect("/api/auth/login");
}

export async function signOut() {
  await deleteSession();
  redirect("/");
}

export async function createWelcomer(guildId: string): Promise<Welcomer> {
  if (!guildId || !(await canUserManageGuild(guildId))) {
    throw new Error("You do not have permission to manage this guild");
  }
  const res = await prisma.welcomer.create({
    data: {
      guildId: guildId,
    },
  });

  revalidatePath(`/app/dashboard/${guildId}/welcome`);

  return res;
}

export async function updateWelcomer(store: WelcomerStore) {
  try {
    const guildId = store.guildId;
    if (!guildId || !(await canUserManageGuild(guildId))) {
      return {
        error: "You do not have permission to manage this guild",
      };
    }
    // if (!store.content && store.embeds.length === 0) {
    //   return {
    //     error: "You need to add some content or embeds",
    //   };
    // }
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
    const module = await prisma.welcomer.update({
      where: {
        guildId: guildId,
      },
      data: {
        channelId: store.channelId,
        content: store.content,
      },
    });

    console.log(module);

    for (const embed of store.embeds) {
      const embedUpdated = await createOrUpdateEmbed(
        embed,
        module.id,
        "welcomer",
      );
      store.embeds[store.embeds.indexOf(embed)] = embedUpdated;
    }
    for (const embed of store.deletedEmbeds) {
      if (embed.id) {
        await prisma.embed.delete({
          where: {
            id: embed.id,
          },
        });
      }
    }
    store.deletedEmbeds = [];
    for (const field of store.deletedFields) {
      if (field.id) {
        await prisma.embedField.delete({
          where: {
            id: field.id,
          },
        });
      }
    }
    store.deletedFields = [];

    revalidatePath(`/app/dashboard/${guildId}/welcome`);
    return {
      done: true,
    };
  } catch (error) {
    console.log(error);
    return {
      error: "An error occurred while updating the welcomer module",
    };
  }
}

export async function createOrUpdateEmbed(
  embed: CompleteEmbed,
  moduleId: number,
  moduleType: "welcomer" | "leaver",
) {
  let embedDb;
  const createOrUpdateAuthor = {
    author: embed.author?.name
      ? {
          upsert: {
            where: {
              embedId: embed.id,
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

  console.log(embed);

  if (embed.id) {
    embedDb = await prisma.embed.update({
      where: {
        id: embed.id,
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

  console.log(embedDb);
  return {
    ...embedDb,
  };
}

export async function removeWelcomer(guildId: string): Promise<boolean> {
  if (!(await canUserManageGuild(guildId))) {
    throw new Error("You do not have permission to manage this guild");
  }
  try {
    await prisma.welcomer.delete({
      where: {
        guildId: guildId,
      },
      // delete all embeds and fields associated with the welcomer
      include: {
        embeds: {
          include: {
            fields: true,
            author: true,
            footer: true,
            image: true,
          },
        },
        DM: true,
      },
    });

    revalidatePath(`/app/dashboard/${guildId}/welcome`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
