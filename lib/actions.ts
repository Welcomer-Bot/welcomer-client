"use server";

import { Embed, Guild, Welcomer } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { canUserManageGuild } from "./dal";
import prisma from "./prisma";
import { deleteSession } from "./session";

export async function signIn() {
  redirect("/api/auth/login");
}

export async function signOut() {
  await deleteSession();
  redirect("/");
}

export async function createGuild(guildId: string): Promise<Guild> {
  try {
    const res = await prisma.guild.upsert({
      where: { id: guildId },
      update: {},
      create: {
        id: guildId,
      },
    });

    return res;
  } catch (error) {
    throw new Error("Failed to create guild");
  }
}

export async function createWelcomer(
  guildId: string,
): Promise<Welcomer | null> {
  try {
    if (!(await canUserManageGuild(guildId))) return null;

    const res = await prisma.welcomer.create({
      data: {
        guildId: guildId,
      },
    });

    revalidatePath(`/app/dashboard/${guildId}/welcome`);

    return res;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create welcomer");
  }
}

export async function removeWelcomer(
  guildId: string,
): Promise<Welcomer | null> {
  try {
    if (!(await canUserManageGuild(guildId))) return null;

    const res = await prisma.welcomer.delete({
      where: {
        guildId: guildId,
      },
    });

    revalidatePath(`/app/dashboard/${guildId}/welcome`);

    return res;
  } catch (error) {
    console.error(error);

    return null;
  }
}
export async function createEmbed(welcomerId: number): Promise<Embed | null> {
  try {
    const guild = await prisma.welcomer.findUnique({
      where: {
        id: welcomerId,
      },
      select: {
        guildId: true,
      },
    });
    let guildId = guild?.guildId;

    if (!guildId || !(await canUserManageGuild(guildId))) return null;
    const res = await prisma.embed.create({
      data: {
        welcomerId: welcomerId,
      },
    });

    revalidatePath(`/app/dashboard/${welcomerId}/welcome`);

    return res;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create embed");
  }
}

export async function removeEmbeds(welcomerId: number): Promise<void> {
  try {
    const guild = await prisma.welcomer.findUnique({
      where: {
        id: welcomerId,
      },
      select: {
        guildId: true,
      },
    });
    let guildId = guild?.guildId;

    if (!guildId || !(await canUserManageGuild(guildId))) return;
    await prisma.embed.deleteMany({
      where: {
        welcomerId: welcomerId,
      },
    });

    revalidatePath(`/app/dashboard/${welcomerId}/welcome`);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete embeds");
  }
}

export async function removeEmbed(welcomerId: number, embedId: number) {
  try {
    const guild = await prisma.welcomer.findUnique({
      where: {
        id: welcomerId,
      },
      select: {
        guildId: true,
      },
    });
    let guildId = guild?.guildId;

    if (!guildId || !(await canUserManageGuild(guildId))) return;
    await prisma.embed.delete({
      where: {
        id: embedId,
      },
    });

    revalidatePath(`/app/dashboard/${welcomerId}/welcome`);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete embed");
  }
}

// export async function createField(embedId: number) {
//   try {
//     const embed = await prisma.embed.findUnique({
//       where: {
//         id: embedId,
//       },
//       select: {
//         welcomerId: true,
//       },
//     });
//     let welcomerId = embed?.welcomerId;
//     const guild = await prisma.welcomer.findUnique({
//       where: {
//         id: welcomerId!,
//       },
//       select: {
//         guildId: true,
//       },
//     });
//     let guildId = guild?.guildId;

//     if (!guildId || !(await canUserManageGuild(guildId))) return;
//     await prisma.embedField.create({
//       data: {
//         embedId: embedId,
//         name: null,
//         value: null,
//       },
//     });

//     revalidatePath(`/app/dashboard/${welcomerId}/welcome`);
//   } catch (error) {
//     console.error(error);
//     throw new Error("Failed to create field");
//   }
// }
