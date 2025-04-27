import { NextResponse } from "next/server";

const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;
const REDIRECT_URI = process.env.REDIRECT_URI!;

export async function GET() {
  const scope = "identify guilds";
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scope)}`;

  return NextResponse.redirect(discordAuthUrl);
}
