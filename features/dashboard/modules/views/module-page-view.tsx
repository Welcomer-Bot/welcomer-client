import { redirect } from "next/navigation";

import { Editor } from "@/components/dashboard/guild";
import { DashboardModuleSlug, getDashboardModuleBySlug, } from "@/features/dashboard/modules/config";
import { getUserGuild } from "@/lib/dal/session";
import { getSources } from "@/lib/dal/sources";

import { ModuleHeader } from "./module-header";

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

  const [sources, guild] = await Promise.all([
    getSources(guildId, moduleConfig.sourceType),
    getUserGuild(guildId),
  ]);
  const source = sources?.[0];

  if (!guild) {
    redirect("/dashboard");
  }

  return (
    <div className="w-full h-full">
      <ModuleHeader
        guildId={guild.id}
        moduleConfig={moduleConfig}
        sourceId={source?.id}
      />
      {source ? <Editor guild={guild}/> : (
        <div className="flex h-full w-full items-center justify-center my-auto">Enable the module to use it !</div>
      )}
    </div>
  );
}
