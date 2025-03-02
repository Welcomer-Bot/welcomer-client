import {
  RESTGetAPICurrentUserGuildsResult,
  RESTGetAPIUserResult,
} from "discord-api-types/v10";
import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";

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
      return redirect("/");
    }

    return redirect(`/auth/error?error=${error}&error_description=${error_description}`);
  }

  if (!code) {
    return redirect(

      "/auth/error?error=codeMissing&error_description=The+authorization+code+is+missing",

    );
  }

  // try {
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

      return new Response(
        JSON.stringify({
          error: "invalid_grant",
          error_description: "The authorization code is invalid or expired",
        }),
        {
          status: 400,
          statusText: "Bad Request",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        authorization: `${tokenData.token_type} ${tokenData.access_token}`,
      },
    });

    const userData: RESTGetAPIUserResult = await userResponse.json();

    if (!userData.id) {
      return new Response(
        JSON.stringify({
          error: "userDataMissing",
          error_description: "An error occurred while fetching user data",
        }),
        {
          status: 500,
          statusText: "Internal Server Error",
          headers: {
            "Content-Type": "application/json",
          },

        }
      );
    }

    const userGuilds = await fetch("https://discord.com/api/users/@me/guilds?with_counts=true", {
      headers: {
        authorization: `${tokenData.token_type} ${tokenData.access_token}`,
      },
    });

    if (!userGuilds.ok) {
      return new Response(
        JSON.stringify({
          error: "userGuildsDataMissing",
          error_description: "An error occurred while fetching user guilds data",
        }),
        {
          status: 500,
          statusText: "Internal Server Error",
          headers: {
            "Content-Type": "application/json",
          },
        }
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

    const userGuildsData = guilds.filter((guild) => {
      return guild.owner || (Number(guild.permissions) & 0x20) === 0x20;
    });

    for (let i = 0; i < userGuildsData.length; i++) {
      // await createGuild(userGuildsData[i].id);
      await prisma.guild.upsert({
        where: { id: userGuildsData[i].id },
        update: {
          User: {
            connect: {
              id: user.id,
            }
          }
        },
        create: {
          id: userGuildsData[i].id,
          name: userGuildsData[i].name,
          icon: userGuildsData[i].icon,
          memberCount: userGuildsData[i].approximate_member_count,
          User: {
            connect: {
              id: user.id,
            }
          },
        },
      });
    }

    await createSession(user.id);

  // } catch (e) {
  //   console.log(e);

  //   return new Response(
  //     JSON.stringify({
  //       error: "internalServerError",
  //       error_description: "An internal server error occurred",
  //     }),
  //     {
  //       status: 500,
  //       statusText: "Internal Server Error",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  // }
  return new Response(
    JSON.stringify({
      success: true,
    }),
    {
      status: 200,
      statusText: "OK",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

}
