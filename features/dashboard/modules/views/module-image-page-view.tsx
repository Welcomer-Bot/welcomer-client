import { Card } from "@heroui/card";

import { ImageEditor as Editor } from "@/components/dashboard/guild";
import { DashboardModuleSlug, getDashboardModuleBySlug } from "@/features/dashboard/modules/config";
import { redirect } from "next/navigation";

export function ModuleImagePageView({
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

  return (
    <Card
      radius="none"
      className="h-fit md:h-full lg:overflow-y-clip overflow-y-scroll w-full"
    >
      <Editor module={moduleConfig.sourceType} guildId={guildId} />
    </Card>
  );
}

