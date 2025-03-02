const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;

export function inviteBotToGuild(guildId: string) {
    return `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&permissions=8&scope=bot&guild_id=${guildId}`
}