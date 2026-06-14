import { notFound } from "next/navigation";

import { DASHBOARD_MODULE_SLUGS, type DashboardModuleSlug } from "@/features/dashboard/modules/config";
import { ModuleImagePageView } from "@/features/dashboard/modules/views/module-image-page-view";

export default async function Page({
  params,
}: {
  params: Promise<{ guildId: string; module: string }>;
}) {
  const { guildId, module } = await params;
  if (!DASHBOARD_MODULE_SLUGS.includes(module as DashboardModuleSlug)) {
    notFound();
  }

  return <ModuleImagePageView guildId={guildId} moduleSlug={module as DashboardModuleSlug} />;
}

