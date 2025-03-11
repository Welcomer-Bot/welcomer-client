import { NextRequest } from "next/server";

import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";


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

  try {
    const session = await createSession(code);

    if (!session) {

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


    // if (!userData.id) {
    //   return new Response(
    //     JSON.stringify({
    //       error: "userDataMissing",
    //       error_description: "An error occurred while fetching user data",
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

    // const userGuilds = await fetch("https://discord.com/api/users/@me/guilds?with_counts=true", {
    //   headers: {
    //     authorization: `${tokenData.token_type} ${tokenData.access_token}`,
    //   },
    // });

    // if (!userGuilds.ok) {
    //   return new Response(
    //     JSON.stringify({
    //       error: "userGuildsDataMissing",
    //       error_description: "An error occurred while fetching user guilds data",
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
    // const guilds: RESTGetAPICurrentUserGuildsResult = await userGuilds.json();
    // const userGuildsData = guilds.filter((guild) => {
    //   return guild.owner || (Number(guild.permissions) & 0x20) === 0x20;
    // });

    // for (let i = 0; i < userGuildsData.length; i++) {
    //   // await createGuild(userGuildsData[i].id);
    //   await prisma.guild.upsert({
    //     where: { id: userGuildsData[i].id },
    //     update: {
    //       User: {
    //         connect: {
    //           id: user.id,
    //         }
    //       }
    //     },
    //     create: {
    //       id: userGuildsData[i].id,
    //       name: userGuildsData[i].name,
    //       icon: userGuildsData[i].icon,
    //       memberCount: userGuildsData[i].approximate_member_count,
    //       User: {
    //         connect: {
    //           id: user.id,
    //         }
    //       },
    //     },
    //   });
    // }


  } catch (e) {
    console.log(e);

    return new Response(
      JSON.stringify({
        error: "internalServerError",
        error_description: "An internal server error occurred",
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
