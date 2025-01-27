import { Card, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { redirect } from "next/navigation";

import RemoveModuleButton from "@/components/dashboard/guild/RemoveModuleButton";
import AppInitializer from "@/components/dashboard/guild/editor/appInitialiser";
import { Editor } from "@/components/dashboard/guild/editor/editor";
import EnableModuleButton from "@/components/dashboard/guild/enableModuleButton";
import { getGuild, getLeaver } from "@/lib/dal";

export default async function Page({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const leaverParams = await getLeaver(guildId);
  const guild = await getGuild(guildId);

  if (!guild) redirect("/dashboard");

  const WelcomeCardHeader = () => (
    <CardHeader className="flex justify-between">
      <p>Leaver module status</p>
      {leaverParams ? (
        <RemoveModuleButton guildId={guildId} moduleName="leaver" />
      ) : (
        <EnableModuleButton guildId={guildId} moduleName="leaver"/>
      )}
    </CardHeader>
  );

  return (
    <AppInitializer
      module={leaverParams}
      moduleName={"leaver"}
      guildId={guildId}
    >
      <Card radius="none" className="w-full h-full">
        <WelcomeCardHeader />
        {leaverParams ? (
          <>
            <div className="h-fit md:h-full overflow-y-scroll md:overflow-y-hidden w-full ">
              <Divider className="mb-2" />
              <Editor />
            </div>
          </>
        ) : null}
      </Card>
    </AppInitializer>
  );
}
