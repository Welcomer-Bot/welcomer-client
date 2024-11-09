import { Card, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { redirect } from "next/navigation";

import CreateWelcomerButton from "@/components/dashboard/guild/createWelcomerButton";
import RemoveWelcomerButton from "@/components/dashboard/guild/deleteWelcomerButton";
import { Editor } from "@/components/dashboard/guild/editor/editor";
import { getGuild, getWelcomer } from "@/lib/dal";
import { StoreUpdater } from "@/components/dashboard/guild/storeUpdater";

export default async function Page({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const welcomerParams = await getWelcomer(guildId);
  const guild = await getGuild(guildId);

  if (!guild) redirect("/dashboard");

  const WelcomeCardHeader = () => (
    <CardHeader className="flex justify-between">
      <p>Welcome module status</p>
      {welcomerParams ? (
        <RemoveWelcomerButton guildId={guildId} />
      ) : (
        <CreateWelcomerButton guildId={guildId} />
      )}
    </CardHeader>
  );

  return (
    <Card radius="none" className="w-full h-full">
      <WelcomeCardHeader />
      {welcomerParams && <StoreUpdater module={welcomerParams} />}
      {welcomerParams ? (
        <div className="h-full">
          <Divider className="mb-2" />
          <Editor/>
        </div>
      ) : null}
    </Card>
  );
}
