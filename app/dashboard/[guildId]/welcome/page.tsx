import { Card, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";

import RemoveModuleButton from "@/components/dashboard/guild/RemoveModuleButton";
import { Editor } from "@/components/dashboard/guild/editor/editor";
import EnableModuleButton from "@/components/dashboard/guild/enableModuleButton";
import { getSources, getUserGuild } from "@/lib/dal";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const source = getSources(guildId, "Welcomer");
  const guild = getUserGuild(guildId);
  const welcomerParams = source?.[0];
  
  const WelcomeCardHeader = () => (
    <CardHeader className="flex justify-between">
      <p>Welcome module status</p>
      <Suspense fallback={<div>Loading...</div>}>

      {welcomerParams ? (
        <RemoveModuleButton
        guildId={guildId}
        sourceId={welcomerParams.id}
        sourceType="Welcomer"
        />
      ) : (
        <EnableModuleButton guildId={guildId} sourceType="Welcomer" />
      )}
      </Suspense>
    </CardHeader>
  );

  return (
    <Card radius="none" className="w-full min-h-full">
      <WelcomeCardHeader />
      {welcomerParams ? (
        <>
          <div className="h-fit md:h-full lg:overflow-y-clip overflow-y-scroll overflow-x-hidden w-full ">
            <Divider className="mb-2" />
            {/* <Editor guild={guild} source={welcomerParams} /> */}
          </div>
        </>
      ) : null}
    </Card>
  );
}
