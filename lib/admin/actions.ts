"use server";

import { GuildObject } from "@/lib/discord/guild";
import { revalidatePath } from "next/cache";
import { assertAdminUser } from "./guards";
import {
  addGuildToBeta,
  getGuild,
  getGuildsByUserId,
  removeGuildToBeta,
} from "../dal";

function assertSnowflake(value: string) {
  if (!/^[0-9]+$/.test(value)) {
    throw new Error("Invalid guild id");
  }
}

export async function getUserGuildsForAdmin(userId: string): Promise<GuildObject[]> {
  await assertAdminUser();
  assertSnowflake(userId);
  return (await getGuildsByUserId(userId)) ?? [];
}

export async function removeGuildFromBetaProgram(guildId: string) {
  await assertAdminUser();
  assertSnowflake(guildId);
  const res = await removeGuildToBeta(guildId);
  revalidatePath("/admin");
  return res;
}

export async function enrollGuildToBetaProgram(guildId: string, userId?: string) {
  await assertAdminUser();
  assertSnowflake(guildId);
  const res = await addGuildToBeta(guildId, userId);
  revalidatePath("/admin");
  return res
}

export async function leaveGuild(guildId: string) {
  await assertAdminUser();
  assertSnowflake(guildId);
  const guild = await getGuild(guildId);
  if (!guild) return false;
  const res = await guild.leave();
  revalidatePath("/admin");
  if (!res) return false;
  return guild.toObject();
}
