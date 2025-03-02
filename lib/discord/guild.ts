"use server";

import { revalidatePath } from "next/cache";
import { addGuildToBeta, getUser, removeGuildToBeta } from "../dal";


export async function addGuildToBetaAction(guildId: string): Promise<boolean> {
    const user = await getUser();
    if (!user || user.id !== "479216487173980160") return false;
    const result = !!await addGuildToBeta(guildId);
    if (result) {
        revalidatePath("/admin");
    }
    return result;

}

export async function removeGuildToBetaAction(guildId: string): Promise<boolean> {
    const user = await getUser();
    if (!user || user.id !== "479216487173980160") return false;
    const result = !!await removeGuildToBeta(guildId);
    if (result) {
        revalidatePath("/admin");
    }
    return result;


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
    if (!res.ok) {
        return false;
    }
    revalidatePath("/admin");
    return res.ok;
}