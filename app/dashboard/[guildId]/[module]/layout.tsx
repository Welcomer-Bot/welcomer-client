import { Source } from "@/generated/prisma/client";
import { DASHBOARD_MODULE_SLUGS, type DashboardModuleSlug, getDashboardModuleBySlug } from "@/features/dashboard/modules/config";
import { SourceStoreProvider } from "@/features/dashboard/modules/providers";
import { getSources } from "@/lib/dal/sources";
import { notFound } from "next/navigation";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ guildId: string; module: string }>;
}) {
  const { guildId, module } = await params;
  if (!DASHBOARD_MODULE_SLUGS.includes(module as DashboardModuleSlug)) {
    notFound();
  }

  const moduleConfig = getDashboardModuleBySlug(module);
  if (!moduleConfig) {
    notFound();
  }

  const sources = await getSources(guildId, moduleConfig.sourceType);

  return (
    <SourceStoreProvider
      // Remount on purpose when the provider binds to a different source:
      // switching module reuses this layout instance, and creating the first
      // source turns "new" into a real id. A save only revalidates, so the
      // key holds and in-flight edits survive.
      key={`${moduleConfig.slug}-${sources?.[0]?.id ?? "new"}`}
      initialState={
        sources?.[0]
          ? (sources[0] as Source)
          : {
              guildId,
            }
      }
    >
      {children}
    </SourceStoreProvider>
  );
}


