import { Card, CardBody, CardHeader } from "@heroui/card";
import { redirect } from "next/navigation";

import GuildCard from "@/components/dashboard/guild/guildCard";
import ManageButton from "@/components/dashboard/guild/manageButton";
import StatsViewer from "@/components/dashboard/guild/stats/StatsViewer";
import { getChannel, getGuild, getUserGuild } from "@/lib/dal";
import { DiscordMention } from "@skyra/discord-components-react";

export default async function Page({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const guild = await getUserGuild(guildId);
  const guildModules = await getGuild(guildId);
  const welcomerChannel = guildModules?.welcomer?.channelId ? await getChannel(guildModules.welcomer.channelId) : null;
  const leaverChannel = guildModules?.leaver?.channelId
    ? await getChannel(guildModules.leaver.channelId)
    : null;

  if (!guild) redirect("/dashboard");

  return (
    <div className="overflow-y-scroll h-full no-scrollbar">
      <Card className="sm:mx-5 sm:my-3">
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
                      Status: {guildModules?.welcomer ? "Enabled" : "Disabled"}
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
                  <ManageButton guildId={guild.id} module={"welcomer"} />
                </CardBody>
              </Card>
              <Card>
                <CardHeader>Leaver status</CardHeader>
                <CardBody className="flex flex-row justify-between">
                  <div>
                    <p>
                      Status: {guildModules?.leaver ? "Enabled" : "Disabled"}
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
                  <ManageButton guildId={guild.id} module={"leaver"} />
                </CardBody>
              </Card>
            </div>
            <StatsViewer guildId={guild.id} module={"welcomer"} />
            <StatsViewer guildId={guild.id} module={"leaver"} />
          </CardBody>
        </>
      </Card>
    </div>
  );
}
