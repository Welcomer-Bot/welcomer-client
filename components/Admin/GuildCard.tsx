"use client";

import {
  enrollGuildToBetaProgram,
  leaveGuild,
  removeGuildFromBetaProgram,
} from "@/lib/admin/actions";
import { GuildObject } from "@/lib/discord/guild";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/react";
import Image from "next/image";
import { toast } from "react-toastify";

export default function GuildCard({
  guild,
  userId,
}: {
  guild: GuildObject;
  userId?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row space-x-5">
        <div>
          {guild.iconUrl ? (
            <Image
              className="rounded-lg"
              src={guild.iconUrl}
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
        <div className="flex space-x-2">
          {guild.beta ? (
            <Button
              className="max-w-xs"
              color="danger"
              variant="ghost"
              onPress={async () => {
                const res = await removeGuildFromBetaProgram(guild.id);
                if (res) {
                  toast.success("Left beta program");
                } else {
                  toast.error("Failed to leave beta program");
                }
              }}
            >
              Leave beta program
            </Button>
          ) : (
            <Button
              className="max-w-xs"
              color="primary"
              onPress={async () => {
                const res = await enrollGuildToBetaProgram(guild.id, userId);
                if (res) {
                  toast.success("Enrolled guild to beta program");
                } else {
                  console.log(res);
                  toast.error("Failed to enroll guild to beta program");
                }
              }}
            >
              Integrate guild to beta program
            </Button>
          )}
          {guild.mutual && (
            <Button
              onPress={async () => {
                const res = await leaveGuild(guild.id);
                if (res) {
                  toast.success("Left guild");
                } else {
                  toast.error("Failed to leave guild");
                }
              }}
            >
              Leave guild
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
