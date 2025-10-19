import { Card, CardBody, CardHeader } from "@heroui/card";
import { redirect } from "next/navigation";

import GuildCard from "@/components/dashboard/guild/guild-card";
import ManageButton from "@/components/dashboard/guild/manage-button";
import StatsViewer from "@/components/dashboard/guild/stats/stats-viewer";
import { getGuild, getSources } from "@/lib/dal";

import { DiscordMention } from "@skyra/discord-components-react";

export default async function Page({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const guild = await getGuild(guildId);
  if (!guild) redirect("/dashboard");
  const welcomer = await getSources(guildId, "Welcomer");
  const leaver = await getSources(guildId, "Leaver");

  const welcomerEnabled = welcomer && welcomer.length > 0;
  const leaverEnabled = leaver && leaver.length > 0;

  const welcomerChannel =
    welcomer && welcomerEnabled&& welcomer[0]?.channelId
      ? await guild.getChannel(welcomer[0].channelId)
      : null;
  const leaverChannel =
    leaver && leaverEnabled && leaver[0]?.channelId
      ? await guild.getChannel(leaver[0].channelId)
      : null;

  return (
    <div className="w-full h-full no-scrollbar sm:px-4 sm:py-3">
      <Card
        classNames={{
          base: "w-full",
        }}
      >
        <CardHeader>
          <GuildCard guild={guild} />
        </CardHeader>
        <>
          <CardBody className="space-y-5">
            <p>Member Count: {guild.memberCount}</p>
            <div className=" grid sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader>Welcomer status</CardHeader>
                <CardBody className="flex flex-row justify-between">
                  <div>
                    <p>
                      Status:{" "}
                      <span
                        className={
                          welcomerEnabled ? "text-green-500" : "text-red-500"
                        }
                      >
                        {welcomer && welcomerEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </p>
                    <p>
                      Channel:{" "}
                      {welcomerChannel ? (
                        <DiscordMention type="channel">
                          {welcomerChannel.name}
                        </DiscordMention>
                      ) : (
                        "Not set"
                      )}
                    </p>
                  </div>
                  <ManageButton guildId={guild.id} module={"Welcomer"} />
                </CardBody>
              </Card>
              <Card>
                <CardHeader>Leaver status</CardHeader>
                <CardBody className="flex flex-row justify-between">
                  <div>
                    <p>
                      Status:{" "}
                      <span
                        className={
                          leaverEnabled ? "text-green-500" : "text-red-500"
                        }
                      >
                        {leaver && leaverEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </p>
                    <p>
                      Channel:{" "}
                      {leaverChannel ? (
                        <DiscordMention type="channel">
                          {leaverChannel.name}
                        </DiscordMention>
                      ) : (
                        "Not set"
                      )}
                    </p>
                  </div>
                  <ManageButton guildId={guild.id} module={"Leaver"} />
                </CardBody>
              </Card>
            </div>
            <StatsViewer guildId={guild.id} module={"Welcomer"} />
            <StatsViewer guildId={guild.id} module={"Leaver"} />
          </CardBody>
        </>
      </Card>
    </div>
  );
}
