import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { redirect } from "next/navigation";

import GuildCard from "@/components/dashboard/guild/guildCard";
import { getUserGuild } from "@/lib/dal";
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
          <p className="mb-5">Member Count: {guild.memberCount}</p>
          <Card className="grid grid-cols-2 gap-5">
            {stats &&
              Object.entries(stats).map(([period, stat]) => (
                <Card key={period} className="block">
                  <CardHeader>{period} stats</CardHeader>
                  <CardBody>
                    {stat ? (
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
                    ) : (
                      <CardFooter className="w-full text-center">
                        No data available for this period :(
                      </CardFooter>
                    )}
                  </CardBody>
                </Card>
              ))}
          </Card>
        </CardBody>
      </>
    </Card>
  );
}
