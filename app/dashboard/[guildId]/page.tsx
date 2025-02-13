import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { redirect } from "next/navigation";

import GuildCard from "@/components/dashboard/guild/guildCard";
import { getUserGuild } from "@/lib/dal";
import { fetchGuildStats } from "@/lib/dto";
import StatsViewer from "@/components/dashboard/guild/stats/StatsViewer";

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
            <StatsViewer guildId={guild.id} module={"welcomer"} />
        </CardBody>
      </>
    </Card>
  );
}
