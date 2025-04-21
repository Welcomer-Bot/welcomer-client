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
  const welcomerParams = await getSource(guildId, 1);
  const guild = await getGuild(guildId);
  const user = await getUser();

  if (!guild || !user) redirect("/dashboard");

  const WelcomeCardHeader = () => (
    <CardHeader className="flex justify-between">
      <p>Welcome module status</p>
      {welcomerParams ? (
        <RemoveModuleButton
          guildId={guild.id}
          sourceId={welcomerParams.id}
          sourceType="Welcomer"
        />
      ) : (
        <EnableModuleButton guildId={guild.id} sourceType="Welcomer" />
      )}
    </CardHeader>
  );

  return (
    <Card radius="none" className="w-full min-h-full">
      <WelcomeCardHeader />
      {welcomerParams ? (
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
