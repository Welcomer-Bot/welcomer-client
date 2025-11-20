import { Card, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";

import { Editor } from "@/components/dashboard/guild/editor/editor";
import EnableModuleButton from "@/components/dashboard/guild/enable-module-button";
import RemoveModuleButton from "@/components/dashboard/guild/remove-module-button";
import { getSources, getUserGuild } from "@/lib/dal";

interface WelcomeCardHeaderProps {
  welcomerParams: { id: number } | undefined;
  guildId: string;
}

function WelcomeCardHeader({
  welcomerParams,
  guildId,
}: WelcomeCardHeaderProps) {
  return (
    <CardHeader className="flex justify-between space-x-3">
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
}

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

  return (
    <Card radius="none" className="w-full min-h-full">
      <WelcomeCardHeader welcomerParams={welcomerParams} guildId={guildId} />
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
