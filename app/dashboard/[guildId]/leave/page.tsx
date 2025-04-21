import { Card, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { redirect } from "next/navigation";

import RemoveModuleButton from "@/components/dashboard/guild/RemoveModuleButton";
import { Editor } from "@/components/dashboard/guild/editor/editor";
import EnableModuleButton from "@/components/dashboard/guild/enableModuleButton";
import { getGuild, getSource, getUser } from "@/lib/dal";

export default async function Page({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const leaverParams = await getSource(guildId, 1);
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
            <Editor guild={guild} user={user} />
          </div>
        </>
      ) : null}
    </Card>
  );
}
