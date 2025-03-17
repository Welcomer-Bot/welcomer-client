import { Card, CardBody, CardHeader } from "@heroui/card";
import { redirect } from "next/navigation";

import GuildCard from "@/components/dashboard/guild/guildCard";
import ManageButton from "@/components/dashboard/guild/manageButton";
import StatsViewer from "@/components/dashboard/guild/stats/StatsViewer";
import { getLeaver, getWelcomer } from "@/lib/dal";
import { getUserGuild } from "@/lib/discord/user";
import { DiscordMention } from "@skyra/discord-components-react";

export default async function Page({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const guild = await getUserGuild(guildId);
  if (!guild) redirect("/dashboard");
  const welcomer = await getWelcomer(guildId);
  const leaver = await getLeaver(guildId);
  const welcomerChannel = welcomer?.channelId
    ? await guild.getChannel(welcomer.channelId)
    : null;
  const leaverChannel = leaver?.channelId
    ? await guild.getChannel(leaver.channelId)
    : null;

  return (
    <div className="w-full h-full no-scrollbar">
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
                    <p>Status: {welcomer ? "Enabled" : "Disabled"}</p>
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
                    <p>Status: {leaver ? "Enabled" : "Disabled"}</p>
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
