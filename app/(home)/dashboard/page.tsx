import { Card, CardBody, CardFooter } from "@heroui/card";
import { Image as UIImage } from "@heroui/image";
import NextImage from "next/image";

import InviteBotButton from "@/components/dashboard/InviteBotButton";
import ManageGuildButton from "@/components/dashboard/ManageGuildButton";
import RequestBetaAccessButton from "@/components/dashboard/RequestBetaAccesButton";
import { getGuilds } from "@/lib/dal";
import { getGuildBanner } from "@/lib/utils";

export default async function Page() {
  const guilds = await getGuilds();
  if (!guilds || guilds?.length === 0) {
    return (
      <div className="flex flex-col items-center flex-wrap h-full justify-center gap-4 py-8 md:py-10 ">
        <div className="flex flex-col justify-center text-center text-wrap max-w-lg gap-3">
          <div className="gap-2">
            No guilds found
            <p className="text-sm text-gray-400">
              Please invite the bot to your server and verfiy you have at
              minimum &quot;Manage Server&quot; permissions to start using it.
            </p>
          </div>
          <InviteBotButton />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center content-center h-full justify-center">
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
                  <ManageGuildButton guildId={guild.id} />
                ) : guild.beta ? (
                  <InviteBotButton guildId={guild.id} />
                ) : (
                  <RequestBetaAccessButton />
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
