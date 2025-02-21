"use server";

import { addGuildToBeta, getUser, removeGuildToBeta } from "../dal";

export async function addGuildToBetaAction(guildId: string): Promise<boolean> {
    const user = await getUser();
    if (!user || user.id !== "479216487173980160") return false;
    return !!await addGuildToBeta(guildId);

}

export async function removeGuildToBetaAction(guildId: string): Promise<boolean> {
    const user = await getUser();
    if (!user || user.id !== "479216487173980160") return false;
    return !!await removeGuildToBeta(guildId);

}

export async function leaveGuildAction(guildId: string): Promise<boolean> {
    const user = await getUser();
    if (!user) return false;
    const res = await fetch("https://discord.com/api/users/@me/guilds/" + guildId, {
        method: "DELETE",
        headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
        }
    }
    )
    console.log(res);
    console.log(`Bot ${process.env.DISCORD_BOT_TOKEN}`);
    return res.ok;
}