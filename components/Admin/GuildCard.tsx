"use client";
import {
  addGuildToBetaAction,
  leaveGuildAction,
  removeGuildToBetaAction,
} from "@/lib/discord/guild";
import { getGuildIcon } from "@/lib/utils";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { betaGuild, UserGuild } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { toast } from "react-toastify";

export default function GuildCard({
  guild,
}: {
  guild: UserGuild & {betaGuild: betaGuild,  mutual: boolean }
}) {
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["admin_user"] });
  };

  const handleRemoveFromBeta = async () => {
    const res = await removeGuildToBetaAction(guild.id);
    if (res) {
      invalidateQueries();
      toast.success("Guild removed from beta program");
    } else {
      toast.error("Failed to remove guild from beta program");
    }
    return res;
  };

  const handleAddToBeta = async () => {
    const res = await addGuildToBetaAction(guild.id);
    if (res) {
      invalidateQueries();
      toast.success("Guild added to beta program");
    } else {
      toast.error("Failed to add guild to beta program");
    }
    return res;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row space-x-5">
        <div>
          {guild.icon ? (
            <Image
              className="rounded-lg"
              src={getGuildIcon(guild)}
              alt={`${guild.id} icon`}
              width={48}
              height={48}
            />
          ) : (
            <p className="w-12 h-12 rounded-lg bg-slate-200 text-black px-3 text-small">
              No icon
            </p>
          )}
        </div>
        <div>
          <h3>{guild.name}</h3>
          <p>{guild.id}</p>
        </div>
      </CardHeader>
      <CardBody>
        <p>Member count: {guild.memberCount}</p>
        <div>

        {guild.betaGuild ? (
          <Button
          className="max-w-xs"
          color="danger"
          variant="ghost"
          onPress={handleRemoveFromBeta}
          >
            Leave beta program
          </Button>
        ) : (
          <Button
          className="max-w-xs"
          color="primary"
          onPress={handleAddToBeta}
          >
            Integrate guild to beta program
          </Button>
          )}
          {guild.mutual && <Button onPress={async() => {
            const res = await leaveGuildAction(guild.id);
            if (res) {
              toast.success("Left guild");
            } else {
              toast.error("Failed to leave guild");
            }
            invalidateQueries();
          }}>
            Leave guild
          </Button>}
        </div>
      </CardBody>
    </Card>
  );
}
