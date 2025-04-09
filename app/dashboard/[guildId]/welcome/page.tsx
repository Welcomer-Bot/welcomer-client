import { Card, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { redirect } from "next/navigation";

import RemoveModuleButton from "@/components/dashboard/guild/RemoveModuleButton";
import AppInitializer from "@/components/dashboard/guild/editor/appInitialiser";
import { Editor } from "@/components/dashboard/guild/editor/editor";
import EnableModuleButton from "@/components/dashboard/guild/enableModuleButton";
import { getGuild, getUser, getWelcomer } from "@/lib/dal";
import { CompleteWelcomer } from "@/prisma/schema";

export default async function Page({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const welcomerParams = await getWelcomer(guildId);
  const guild = await getGuild(guildId);
  const user = await getUser()

  if (!guild || !user) redirect("/dashboard");

  const WelcomeCardHeader = () => (
    <CardHeader className="flex justify-between">
      <p>Welcome module status</p>
      {welcomerParams ? (
        <RemoveModuleButton guildId={guildId} moduleName="welcomer" />
      ) : (
        <EnableModuleButton guildId={guildId} moduleName="welcomer"/>
      )}
    </CardHeader>
  );

  return (
    <AppInitializer
      module={welcomerParams as CompleteWelcomer}
      moduleName="welcomer"
      guildId={guildId}
    >
      <Card radius="none" className="w-full min-h-full">
        <WelcomeCardHeader />
        {welcomerParams ? (
          <>
            <div className="h-fit md:h-full lg:overflow-y-clip overflow-y-scroll overflow-x-hidden w-full ">
              <Divider className="mb-2" />
              <Editor module="welcomer" guild={guild} user={user} />
            </div>
          </>
        ) : null}
      </Card>
    </AppInitializer>
  );
}
