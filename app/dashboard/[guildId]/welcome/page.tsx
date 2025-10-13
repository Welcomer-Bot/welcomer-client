import { Card, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";

import RemoveModuleButton from "@/components/dashboard/guild/remove-module-button";
import { Editor } from "@/components/dashboard/guild/editor/editor";
import EnableModuleButton from "@/components/dashboard/guild/enable-module-button";
import { getSources, getUserGuild } from "@/lib/dal";

export default async function Page({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const source = await getSources(guildId, "Welcomer");
  const welcomerParams = source?.[0];
  const guild = await getUserGuild(guildId);
  if (!guild) {
    return <div>Guild not found</div>;
  }

  const WelcomeCardHeader = () => (
    <CardHeader className="flex justify-between">
      <p>Welcome module status</p>
      {welcomerParams ? (
        <RemoveModuleButton
          guildId={guildId}
          sourceId={welcomerParams.id}
          sourceType="Welcomer"
        />
      ) : (
        <EnableModuleButton guildId={guildId} sourceType="Welcomer" />
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
            <Editor guild={guild} />
          </div>
        </>
      ) : null}
    </Card>
  );
}
