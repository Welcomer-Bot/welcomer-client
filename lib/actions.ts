"use server";

import { redirect } from "next/navigation";
import prisma from "./prisma";

import { CompleteEmbed, CompleteEmbedField } from "@/prisma/schema";
import { WelcomerStore } from "@/state/welcomer";
import { Welcomer } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { canUserManageGuild } from "./dal";
import { deleteSession } from "./session";

export async function signIn() {
  redirect("/api/auth/login");
}

export async function signOut() {
  await deleteSession();
  redirect("/");
}

export async function createWelcomer(guildId: string): Promise<Welcomer> {
  if (!(await canUserManageGuild(guildId))) {
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
  const guildId = store.guildId;
  if (!(await canUserManageGuild(guildId))) {
    throw new Error("You do not have permission to manage this guild");
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

  for (const embed of store.embeds) {
    await createOrUpdateEmbed(embed, module.id, "welcomer");
  }
}

export async function createOrUpdateEmbed(
  embed: CompleteEmbed,
  moduleId: number,
  moduleType: "welcomer" | "leaver"
) {
  let embedDb;
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
      },
    });
  }

  const embedAuthor = await prisma.embedAuthor.upsert({
    where: {
      embedId: embedDb.id,
    },
    update: {
      name: embed.author?.name,
      iconUrl: embed.author?.iconUrl,
      url: embed.author?.url,
    },
    create: {
      embedId: embedDb.id,
      name: embed.author?.name,
      iconUrl: embed.author?.iconUrl,
      url: embed.author?.url,
    },
  });

  const embedFooter = await prisma.embedFooter.upsert({
    where: {
      embedId: embedDb.id,
    },
    update: {
      text: embed.footer?.text,
      iconUrl: embed.footer?.iconUrl,
    },
    create: {
      embedId: embedDb.id,
      text: embed.footer?.text,
      iconUrl: embed.footer?.iconUrl,
    },
  });

  for (const field of embed.fields) {
    createOrUpdateField(field, embedDb.id);
  }
}

export async function createOrUpdateField(
  field: CompleteEmbedField,
  embedId: number
) {
  if (field.id) {
    await prisma.embedField.update({
      where: {
        id: field.id,
      },
      data: {
        name: field.name,
        value: field.value,
        inline: field.inline,
      },
    });
  } else {
    await prisma.embedField.create({
      data: {
        embedId: embedId,
        name: field.name,
        value: field.value,
        inline: field.inline,
      },
    });
  }
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
