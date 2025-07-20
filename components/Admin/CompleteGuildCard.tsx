"use client";

import {
  enrollGuildToBetaProgram,
  leaveGuild,
  removeGuildFromBetaProgram,
} from "@/lib/admin/actions";
import { GuildObject } from "@/lib/discord/guild";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Source } from "@prisma/client";
import Image from "next/image";
import { toast } from "react-toastify";
import ManageGuildButton from "../dashboard/ManageGuildButton";
import { UserObject } from "@/lib/discord/user";
import { User } from "@heroui/react";

export default function CompleteGuildCard({
  guild,
  welcomer,
    leaver,
  betaTester,
}: {
  guild: GuildObject;
  welcomer?: Source;
        leaver?: Source;
    betaTester?: UserObject | null;
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
      <CardBody className="space-y-4">
              <p>Member count: {guild.memberCount}</p>
              <div className="flex items-center">
                  <p className="mr-2">
                  Testing by:{" "}
                  </p>
                  <User
                      avatarProps={{
                        src: betaTester?.avatarUrl || "",
                        alt: betaTester?.username || "Beta Tester",
                      }}
                      name={betaTester?.username || "Beta Tester"}
                      description={betaTester?.id}
                    className="text-blue-500"
                  />
        </div>
        <div className="flex flex-wrap justify-start align-baseline gap-2">
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
                const res = await enrollGuildToBetaProgram(guild.id);
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
            <>
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
              <ManageGuildButton guildId={guild.id} />
            </>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          {[
            { label: "Welcomer", source: welcomer },
            { label: "Leaver", source: leaver },
          ].map(({ label, source }) => (
            <div key={label}>
              {label}:
              <ul className="list-disc pl-5">
                <li>
                  Enabled:{" "}
                  {source ? (
                    <span className="text-green-500">Yes</span>
                  ) : (
                    <span className="text-red-500">No</span>
                  )}
                </li>
                <li>
                  Channel:{" "}
                  {source?.channelId ? (
                    <span className="text-blue-500">{source.channelId}</span>
                  ) : (
                    "Not set"
                  )}
                </li>
                <li>
                  Last updated:{" "}
                  {source?.updatedAt
                    ? new Date(source.updatedAt).toLocaleString()
                    : "Never"}
                </li>
              </ul>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
