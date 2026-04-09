import { Card, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { redirect } from "next/navigation";

import {
  Editor,
  EnableModuleButton,
  RemoveModuleButton,
} from "@/components/dashboard/guild";
import {
  DashboardModuleConfig,
  DashboardModuleSlug,
  getDashboardModuleBySlug,
} from "@/features/dashboard/modules/config";
import { getSources } from "@/lib/dal/sources";
import { getUserGuild } from "@/lib/dal/session";

function ModuleCardHeader({
  moduleConfig,
  sourceId,
  guildId,
}: {
  moduleConfig: DashboardModuleConfig;
  sourceId?: number;
  guildId: string;
}) {
  return (
    <CardHeader className="flex justify-between space-x-3">
      <p>{moduleConfig.label} module status</p>
      {sourceId ? (
        <RemoveModuleButton
          guildId={guildId}
          sourceId={sourceId}
          sourceType={moduleConfig.sourceType}
        />
      ) : (
        <EnableModuleButton guildId={guildId} sourceType={moduleConfig.sourceType} />
      )}
    </CardHeader>
  );
}

export async function ModulePageView({
  guildId,
  moduleSlug,
}: {
  guildId: string;
  moduleSlug: DashboardModuleSlug;
}) {
  const moduleConfig = getDashboardModuleBySlug(moduleSlug);
  if (!moduleConfig) {
    redirect(`/dashboard/${guildId}`);
  }

  const sources = await getSources(guildId, moduleConfig.sourceType);
  const source = sources?.[0];
  const guild = await getUserGuild(guildId);
  if (!guild) {
    redirect("/dashboard");
  }

  return (
    <Card radius="none" className="w-full min-h-full">
      <ModuleCardHeader
        moduleConfig={moduleConfig}
        sourceId={source?.id}
        guildId={guildId}
      />
      {source ? (
        <div className="h-fit md:h-full lg:overflow-y-clip overflow-y-scroll overflow-x-hidden w-full ">
          <Divider className="mb-2" />
          <Editor guild={guild} />
        </div>
      ) : null}
    </Card>
  );
}

