"use server";

import { getGuildData, getUserData } from "@/lib/dal/session";

export async function getImageRenderContext(guildId: string) {
  const [user, guild] = await Promise.all([
    getUserData(),
    getGuildData(guildId),
  ]);
  return { user, guild };
}
