import Guild, { GuildObject } from "@/lib/discord/guild";
import { Card, CardBody } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import Image from "next/image";

export default function GuildCard({
  guild,
  isOpen = true,
}: {
  guild: Guild | GuildObject;
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

export function GuildCardSkeleton({ isOpen = true }: { isOpen?: boolean }) {
  return (
    <Card className="flex flex-row items-center content-center" radius="sm">
      <CardBody
        className={`items-baseline transition-all ${isOpen ? "" : "m-0 p-0 w-full items-center"}`}
      >
        <div className="flex transition-all items-center">
          <Skeleton className="w-10 h-10 shrink-0 rounded-full mr-3">
            <div className="w-10 h-10 rounded-full bg-default-200"></div>
          </Skeleton>
          <div
            className={`transition-all space-y-1 ${isOpen ? "w-48 ml-2" : "w-0 ml-0 overflow-hidden"}`}
          >
            <Skeleton className="w-3/5 rounded-lg">
              <div className="h-5 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-4 w-4/5 rounded-lg bg-default-300"></div>
            </Skeleton>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
