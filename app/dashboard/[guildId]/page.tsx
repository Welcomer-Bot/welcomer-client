import { Card, CardBody, CardHeader } from "@heroui/card";
import { redirect } from "next/navigation";

import { getUserGuild } from "@/lib/dal";
import GuildCard from "@/components/dashboard/guild/guildCard";

export default async function Page({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const guild = await getUserGuild(guildId);

  if (!guild) redirect("/dashboard");

  return (

      <Card>
      <CardHeader>
        <GuildCard guild={guild}/>
      </CardHeader>
      
      </Card>
  );
}
