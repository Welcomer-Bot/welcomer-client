import { Card, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { redirect } from "next/navigation";

import RemoveModuleButton from "@/components/dashboard/guild/remove-module-button";
import { Editor } from "@/components/dashboard/guild/editor/editor";
import EnableModuleButton from "@/components/dashboard/guild/enable-module-button";
import { getGuild, getSources, getUser } from "@/lib/dal";

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

  const LeaverCardHeader = () => (
    <CardHeader className="flex justify-between">
      <p>Welcome module status</p>
      {leaverParams ? (
        <RemoveModuleButton
          guildId={guild.id}
          sourceId={leaverParams.id}
          sourceType="Leaver"
        />
      ) : (
        <EnableModuleButton guildId={guild.id} sourceType="Leaver" />
      )}
    </CardHeader>
  );
  return (
    <Card radius="none" className="w-full min-h-full">
      <LeaverCardHeader />
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
