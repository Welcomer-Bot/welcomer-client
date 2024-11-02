import {
  RESTGetAPICurrentUserGuildsResult,
  RESTGetAPIUserResult,
} from "discord-api-types/v10";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { createSession } from "@/lib/session";

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI!;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const error_description =
    searchParams.get("error_description") ??
    "An error occurred during authentication";

  if (error) {
    if (error == "access_denied") {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }

    return NextResponse.redirect(
      new URL(
        `/auth/error?error=${error}&error_description=${error_description}`,
        request.nextUrl,
      ),
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL(
        "/auth/error?error=codeMissing&error_description=The+authorization+code+is+missing",
        request.nextUrl,
      ),
    );
  }

  try {
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      const url = new URL(
        `/auth/error?error=${tokenData.error}&error_description=${tokenData.error_description}`,
        request.nextUrl,
      );

      return NextResponse.redirect(url);
    }

    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        authorization: `${tokenData.token_type} ${tokenData.access_token}`,
      },
    });

    const userData: RESTGetAPIUserResult = await userResponse.json();

    if (!userData.id) {
      return NextResponse.redirect(
        new URL(
          "/auth/error?error=userDataMissing&error_description=An+error+occured+while+fetching+user+data",
          request.nextUrl,
        ),
      );
    }

    const userGuilds = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        authorization: `${tokenData.token_type} ${tokenData.access_token}`,
      },
    });

    if (!userGuilds.ok) {
      return NextResponse.redirect(
        new URL(
          "/auth/error?error=guildsDataMissing&error_description=An+error+occured+while+fetching+user+guilds",
          request.nextUrl,
        ),
      );
    }
    const guilds: RESTGetAPICurrentUserGuildsResult = await userGuilds.json();

    const user = await prisma.user.upsert({
      where: { id: userData.id },
      update: {
        username: userData.username,
        avatar: userData.avatar,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
      },
      create: {
        id: userData.id,
        discriminator: userData.discriminator,
        username: userData.username,
        avatar: userData.avatar,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
      },
    });

    // for (const guild of guilds) {
    //   await prisma.guild.create({
    //     data: {
    //       id: guild.id,
    //     },
    //   });
    // }
    // add guilds to user
    await prisma.userGuild.deleteMany({
      where: {
        userId: userData.id,
      },
    });

    const userGuildsData = guilds.filter((guild) => {
      return guild.owner || (Number(guild.permissions) & 0x20) === 0x20;
    });

    for (let i = 0; i < userGuildsData.length; i++) {
      // await createGuild(userGuildsData[i].id);
      await prisma.userGuild.create({
        data: {
          userId: userData.id,
          id: userGuildsData[i].id,
          name: userGuildsData[i].name,
          icon: userGuildsData[i].icon,
          permissions: userGuildsData[i].permissions?.toString(),
        },
      });
    }

    await createSession(user.id);

    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  } catch (e) {
    console.log(e);

    return NextResponse.redirect(
      new URL(
        "/auth/error?error=authFailed&error_description=An+unknown+error+occured+while+authenticating",
        request.nextUrl,
      ),
    );
  }
}
