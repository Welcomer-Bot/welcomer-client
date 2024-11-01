"use server";

import { redirect } from "next/navigation";
import prisma from "./prisma";

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
  if (!canUserManageGuild(guildId)) {
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


export async function removeWelcomer(guildId: string): Promise<boolean> {
  if (!canUserManageGuild(guildId)) {
    throw new Error("You do not have permission to manage this guild");
  }
  try {
    
    await prisma.welcomer.delete({
      where: {
        guildId: guildId,
      },
    });
    
    revalidatePath(`/app/dashboard/${guildId}/welcome`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}