import { Card, CardBody } from "@nextui-org/card";
import { APIGuild } from "discord-api-types/v10";
import Image from "next/image";

import { getGuildIcon } from "@/lib/utils";

export default function GuildCard({
  guild,
  isOpen = true,
}: {
  guild: APIGuild;
  isOpen?: boolean;
}) {
  return (
    <Card
      className="flex flex-row items-center content-center h-20"
      radius="sm"
    >
      <CardBody
        className={`items-baseline transition-all ${isOpen ? "" : "m-0 p-0 w-full items-center"}`}
      >
        <div className="flex transition-all items-center">
          <Image
            alt={guild.name}
            className={`rounded-full w-10 h-10 ${isOpen ? "mr-2" : ""}`}
            height={40}
            src={getGuildIcon(guild)}
            width={40}
          />
          <div className={`truncate transition-all ${isOpen ? "w-48" : "w-0"}`}>
            <h3 className="text-lg truncate">{guild.name}</h3>
            <p className="text-gray-500 truncate">{guild.id}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
