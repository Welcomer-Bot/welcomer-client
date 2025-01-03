import { Card, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { redirect } from "next/navigation";

import CreateWelcomerButton from "@/components/dashboard/guild/createWelcomerButton";
import RemoveWelcomerButton from "@/components/dashboard/guild/deleteWelcomerButton";
import AppInitializer from "@/components/dashboard/guild/editor/appInitialiser";
import { Editor } from "@/components/dashboard/guild/editor/editor";
import { getGuild, getWelcomer } from "@/lib/dal";

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
    <AppInitializer module={welcomerParams} guildId={guildId}>
      <Card radius="none" className="w-full h-full">
        <WelcomeCardHeader />
        {welcomerParams ? (
          <>
            <div className="h-fit md:h-full overflow-y-scroll md:overflow-y-hidden ">
              <Divider className="mb-2" />
              <Editor guildId={guild.id} />
            </div>
          </>
        ) : null}
      </Card>
    </AppInitializer>
  );
}
