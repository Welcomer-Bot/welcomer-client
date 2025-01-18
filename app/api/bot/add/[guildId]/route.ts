import { NextResponse } from "next/server";

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
export async function GET(
  request: Request,
  { params }: { params: Promise<{ guildId: string }> }
) {
    const guildId = (await params).guildId;
  const link = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&permissions=8&scope=bot&guild_id=${guildId}`;
  return NextResponse.redirect(link);
}
