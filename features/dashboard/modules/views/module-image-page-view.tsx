import { redirect } from "next/navigation";

import { ImageEditor as Editor } from "@/components/dashboard/guild";
import {
  DashboardModuleSlug,
  getDashboardModuleBySlug,
} from "@/features/dashboard/modules/config";
import { getUserGuild } from "@/lib/dal/session";
import { getSources } from "@/lib/dal/sources";

import { ModuleHeader } from "./module-header";

export async function ModuleImagePageView({
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

  const [sources, guild] = await Promise.all([
    getSources(guildId, moduleConfig.sourceType),
    getUserGuild(guildId),
  ]);
  const source = sources?.[0];

  if (!guild) {
    redirect("/dashboard");
  }

  return (
    <div className="w-full">
      <ModuleHeader
        channelId={source?.channelId}
        guild={guild}
        moduleConfig={moduleConfig}
        sourceId={source?.id}
      />
      <Editor guildId={guildId} />
    </div>
  );
}
