import { Card, CardBody, CardHeader } from "@heroui/card";
import { redirect } from "next/navigation";

import { getGuildStats, getUserGuild } from "@/lib/dal";
import GuildCard from "@/components/dashboard/guild/guildCard";
import { fetchGuildStats } from "@/lib/dto";

export default async function Page({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const guild = await getUserGuild(guildId);
  const stats = await fetchGuildStats(guildId, "welcomer");

  if (!guild) redirect("/dashboard");

  return (
    <Card className="mx-5 my-3">
      <CardHeader>
        <GuildCard guild={guild} />
      </CardHeader>
        <>
          <CardBody>
            <p>
              Member Count: {guild.memberCount}
            </p>
          {
            stats && stats.map((stat) => stat && (
              <div key={stat.period}>
              <h2>Daily stats</h2>
              <div className="grid grid-cols-3">
                <Card>
                  <CardHeader>Members welcomed</CardHeader>
                  <CardBody>{stat.membersEvent}</CardBody>
                </Card>
                <Card>
                  <CardHeader>Generated Messages</CardHeader>
                  <CardBody>{stat.generatedMessages}</CardBody>
                </Card>
                <Card>
                  <CardHeader>Generated Images</CardHeader>
                  <CardBody>{stat.generatedImages}</CardBody>
                </Card>
                <Card>
                  <CardHeader>Generated Embeds</CardHeader>
                  <CardBody>{stat.generatedEmbeds}</CardBody>
                </Card>
              </div>
            </div>
            ))
            }
          </CardBody>
        </>
    </Card>
  );
}
