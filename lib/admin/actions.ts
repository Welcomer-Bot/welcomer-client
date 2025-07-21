"use server";

import { revalidatePath } from "next/cache";
import { addGuildToBeta, getGuild, removeGuildToBeta } from "../dal";

export async function removeGuildFromBetaProgram(guildId: string) {
  const res = await removeGuildToBeta(guildId);
  revalidatePath("/admin");
  return res;
}

export async function enrollGuildToBetaProgram(guildId: string, userId?: string) {
  const res = await addGuildToBeta(guildId, userId);
  revalidatePath("/admin");
  return res
}

export async function leaveGuild(guildId: string) {
  const guild = await getGuild(guildId);
  if (!guild) return false;
  const res = await guild.leave();
  revalidatePath("/admin");
  if (!res) return false;
  return guild.toObject();
}
