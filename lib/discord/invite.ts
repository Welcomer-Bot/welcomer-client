"use server";

import { redirect } from "next/navigation";

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;

export async function inviteBotToGuild(guildId: string) {
    redirect(`https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&permissions=8&scope=bot&guild_id=${guildId}`);
}