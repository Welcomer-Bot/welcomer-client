import { Card, CardBody } from "@heroui/card";
import { redirect } from "next/navigation";

import { getUserGuild } from "@/lib/dal";

export default async function Page({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const guild = await getUserGuild(guildId);

  if (!guild) redirect("/dashboard");

  return (
    <>
      <Card>
        <CardBody>{guild.name}</CardBody>
      </Card>
    </>
  );
}
