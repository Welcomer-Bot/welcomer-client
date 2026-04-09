import { redirect, notFound } from "next/navigation";

import { BaseCardConfig } from "@/components/dashboard/guild/image-editor/types";
import {
  DASHBOARD_MODULE_SLUGS,
  type DashboardModuleSlug,
  getDashboardModuleBySlug,
} from "@/features/dashboard/modules/config";
import { ImageCardStoreProvider } from "@/features/dashboard/modules/providers";
import { getSources } from "@/lib/dal/sources";
import prisma from "@/lib/prisma";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    guildId: string;
    module: string;
  }>;
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
  const source = sources?.[0] ?? null;

  if (!source) {
    redirect(`/dashboard/${guildId}`);
  }

  const imageCard = source.activeCardId
    ? await prisma.imageCard.findUnique({
        where: { id: source.activeCardId },
      })
    : null;

  return (
    <ImageCardStoreProvider
      initialState={
        imageCard
          ? {
              id: imageCard.id,
              sourceId: imageCard.sourceId,
              data: imageCard.data as BaseCardConfig,
              createdAt: imageCard.createdAt,
              updatedAt: imageCard.updatedAt,
            }
          : {
              sourceId: source.id,
            }
      }
    >
      {children}
    </ImageCardStoreProvider>
  );
}


