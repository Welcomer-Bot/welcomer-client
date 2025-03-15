"use client";

import {
  enrollGuildToBetaProgram,
  leaveGuild,
  removeGuildFromBetaProgram,
} from "@/lib/admin/actions";
import { GuildObject } from "@/lib/discord/guild";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";

export default function GuildCard({ guild }: { guild: GuildObject }) {
  const [currentGuild, setCurrentGuild] = useState<GuildObject>(guild);
  return (
    <Card>
      <CardHeader className="flex flex-row space-x-5">
        <div>
          {currentGuild.iconUrl ? (
            <Image
              className="rounded-lg"
              src={currentGuild.iconUrl}
              alt={`${currentGuild.id} icon`}
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
          <h3>{currentGuild.name}</h3>
          <p>{currentGuild.id}</p>
        </div>
      </CardHeader>
      <CardBody>
        <p>Member count: {currentGuild.memberCount}</p>
        <div>
          {currentGuild.beta ? (
            <Button
              className="max-w-xs"
              color="danger"
              variant="ghost"
              onPress={async () => {
                const res = await removeGuildFromBetaProgram(currentGuild.id);
                if (res) {
                  setCurrentGuild(res);
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
                const res = await enrollGuildToBetaProgram(currentGuild.id);
                if (res) {
                  setCurrentGuild(res);

                  toast.success("Enrolled guild to beta program");
                } else {
                  toast.error("Failed to enroll currentGuild to beta program");
                }
              }}
            >
              Integrate guild to beta program
            </Button>
          )}
          {currentGuild.mutual && (
            <Button
              onPress={async () => {
                const res = await leaveGuild(currentGuild.id);
                if (res) {
                  setCurrentGuild(res);

                  toast.success("Left guild");
                } else {
                  toast.error("Failed to leave currentGuild");
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
