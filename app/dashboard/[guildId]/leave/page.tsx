import { Card, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { redirect } from "next/navigation";

import { Editor } from "@/components/dashboard/guild/editor/editor";
import EnableModuleButton from "@/components/dashboard/guild/enable-module-button";
import RemoveModuleButton from "@/components/dashboard/guild/remove-module-button";
import { getGuild, getSources, getUser } from "@/lib/dal";

interface LeaverCardHeaderProps {
  leaverParams: { id: number } | undefined;
  guildId: string;
}

function LeaverCardHeader({ leaverParams, guildId }: LeaverCardHeaderProps) {
  return (
    <CardHeader className="flex justify-between">
      <p>Welcome module status</p>
      {leaverParams ? (
        <RemoveModuleButton
          guildId={guildId}
          sourceId={leaverParams.id}
          sourceType="Leaver"
        />
      ) : (
        <EnableModuleButton guildId={guildId} sourceType="Leaver" />
      )}
    </CardHeader>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const source = await getSources(guildId, "Leaver");
  const leaverParams = source?.[0];
  const guild = await getGuild(guildId);
  const user = await getUser();

  if (!guild || !user) redirect("/dashboard");

  return (
    <Card radius="none" className="w-full min-h-full">
      <LeaverCardHeader leaverParams={leaverParams} guildId={guild.id} />
      {leaverParams ? (
        <>
          <div className="h-fit md:h-full lg:overflow-y-clip overflow-y-scroll overflow-x-hidden w-full ">
            <Divider className="mb-2" />
            <Editor guild={guild} />
          </div>
        </>
      ) : null}
    </Card>
  );
}
