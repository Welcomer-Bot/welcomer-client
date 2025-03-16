import { Card, CardBody } from "@heroui/card";
import Image from "next/image";

import Guild from "@/lib/discord/guild";

export default function GuildCard({
  guild,
  isOpen = true,
}: {
  guild: Guild;
  isOpen?: boolean;
}) {
  return (
    <Card className="flex flex-row items-center content-center" radius="sm">
      <CardBody
        className={`items-baseline transition-all ${isOpen ? "" : "m-0 p-0 w-full items-center"}`}
      >
        <div className="flex transition-all items-center">
          {guild.iconUrl ? (
            <Image
              alt={guild.name}
              className={`rounded-full w-10 h-10`}
              height={40}
              src={guild.iconUrl}
              width={40}
            />
          ) : (
            <div className="w-10 h-10 shrink-0 border-solid border-1 border-white shadow-2xl rounded-large flex justify-center items-center mr-3">
              {guild.name[0]}
            </div>
          )}
          <div
            className={`truncate transition-all ${isOpen ? "w-48 ml-2" : "w-0 ml-0"}`}
          >
            <h3 className="text-lg truncate">{guild.name}</h3>
            <p className="text-gray-500 truncate">{guild.id}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
