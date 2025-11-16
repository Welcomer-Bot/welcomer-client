import { BaseCardConfig } from "@/components/dashboard/guild/image-editor/types";
import { getSources } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { ImageCardStoreProvider } from "@/providers/imageCardStoreProvider";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    guildId: string;
  }>;
}) {
  const { guildId } = await params;
  const sources = await getSources(guildId, "Leaver");

  // Get the first source and its active card
  const source = sources && sources[0] ? sources[0] : null;

  if (!source) {
    redirect("/dashboard/" + guildId);
  }
  let imageCard = null;
  if (source?.activeCardId) {
    imageCard = await prisma.imageCard.findUnique({
      where: { id: source.activeCardId },
    });
  }

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
              sourceId: source?.id || 0,
            }
      }
    >
      {children}
    </ImageCardStoreProvider>
  );
}
