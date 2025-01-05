import { Card, CardBody } from "@nextui-org/card";
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
