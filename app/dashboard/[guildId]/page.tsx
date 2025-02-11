import { Card, CardBody, CardHeader } from "@heroui/card";
import { redirect } from "next/navigation";

import { getGuildStats, getUserGuild } from "@/lib/dal";
import GuildCard from "@/components/dashboard/guild/guildCard";

export default async function Page({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const guild = await getUserGuild(guildId);
  const stats = await getGuildStats(guildId, "DAILY", "welcomer")

  if (!guild) redirect("/dashboard");

  return (
    <Card>
      <CardHeader>
        <GuildCard guild={guild} />
      </CardHeader>
        <>
          <CardBody>
            <p>
              Member Count: {guild.memberCount}
            </p>
      {stats ? (
            <div>
              <h2>Daily stats</h2>
              <div className="grid grid-cols-3">
                <Card>
                  <CardHeader>Members welcomed</CardHeader>
                  <CardBody>{stats.membersEvent}</CardBody>
                </Card>
                <Card>
                  <CardHeader>Generated Messages</CardHeader>
                  <CardBody>{stats.generatedMessages}</CardBody>
                </Card>
                <Card>
                  <CardHeader>Generated Images</CardHeader>
                  <CardBody>{stats.generatedImages}</CardBody>
                </Card>
                <Card>
                  <CardHeader>Generated Embeds</CardHeader>
                  <CardBody>{stats.generatedEmbeds}</CardBody>
                </Card>
              </div>
            </div>
            ) : null}
          </CardBody>
        </>
    </Card>
  );
}
