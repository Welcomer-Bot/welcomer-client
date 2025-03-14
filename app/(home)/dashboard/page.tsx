import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Image as UIImage } from "@heroui/image";
import NextImage from "next/image";
import Link from "next/link";

import { getGuilds } from "@/lib/dal";
import { getGuildBanner } from "@/lib/utils";
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;

export default async function Page() {
  const guilds = await getGuilds();
  if (!guilds || guilds?.length === 0) {
    return (
      <div className="flex flex-col items-center flex-wrap h-full justify-center gap-4 py-8 md:py-10">
        <div className="inline-block justify-center text-wrap">
          No guilds found
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center">
      {guilds?.map((guild) => (
        <Card
          key={guild.id}
          className="w-[350px] relative radius-8 mb-10 min-w-60 justify-evenly mx-4"
        >
          <CardBody className="p-0 flex justify-center">
            <div
              className="image-blured"
              style={{
                backgroundImage: `url(${getGuildBanner(guild)})`,
                filter: "blur(10px)",
                height: "120px",
                backgroundSize: "cover",
                borderRadius: "8px",
                opacity: 0.7,
                backgroundPosition: "center",
              }}
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {guild.iconUrl ? (
                <UIImage
                  alt="Guild Icon"
                  as={NextImage}
                  classNames={{
                    img: "shadow-2xl",
                    wrapper: "w-16 h-16",
                  }}
                  height={64}
                  src={guild.iconUrl}
                  width={64}
                />
              ) : (
                <div className="w-16 h-16 border-solid border-2 border-white shadow-2xl rounded-large flex justify-center items-center">
                  {guild.name[0]}
                </div>
              )}
            </div>
          </CardBody>
          <CardFooter className="flex items-center justify-between">
            <div className="flex flex-row items-center truncate">
              {guild.iconUrl ? (
                <UIImage
                  alt="Guild Icon"
                  as={NextImage}
                  radius="lg"
                  aria-label={guild.name[0]}
                  className="border-white border-solid border-small mr-3"
                  removeWrapper
                  width={48}
                  height={48}
                  src={guild.iconUrl}
                />
              ) : (
                <div className="w-12 h-12 shrink-0 border-solid border-2 border-white shadow-2xl rounded-large flex justify-center items-center mr-3">
                  {guild.name[0]}
                </div>
              )}
              <span className="truncate">{guild.name}</span>
            </div>
            <div>
              {guild.mutual ? (
                <Link href={`/dashboard/${guild.id}`}>
                  <Button className="right ml-2 font-bold" color="primary">
                    Manage
                  </Button>
                </Link>
              ) : guild.beta ? (
                <Link
                  href={`https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&permissions=8&scope=bot&guild_id=${guild.id}`}
                >
                  <Button
                    className="right ml-2 font-bold"
                    color="default"
                    type="submit"
                  >
                    Invite Bot
                  </Button>
                </Link>
              ) : (
                <Link href={`/support`}>
                  <Button
                    className="right ml-2 font-bold"
                    color="default"
                    type="submit"
                  >
                    Request Beta Access
                  </Button>
                </Link>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
