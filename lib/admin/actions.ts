'use server'

import { revalidatePath } from "next/cache";
import { getUserGuild } from "../discord/user";


export async function removeGuildFromBetaProgram(guildId: string) {
    const guild = await getUserGuild(guildId);
    if (!guild) return false
    const res = await guild.removeFromBetaProgram();
    if (!res) return false;
    revalidatePath("/admin");
    return guild.toObject();
}

export async function enrollGuildToBetaProgram(guildId: string) {
    const guild = await getUserGuild(guildId);
    if (!guild) return false
    const res = await guild.enrollToBetaProgram();
    revalidatePath("/admin");
    if (!res) return false;
    return guild.toObject();
}

export async function leaveGuild(guildId: string) {
    const guild = await getUserGuild(guildId);
    if (!guild) return false
    const res = await guild.leave();
    revalidatePath("/admin");
    if (!res) return false;
    return guild.toObject();
}