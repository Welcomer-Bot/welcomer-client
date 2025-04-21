import { getSourceCards, getSources } from "@/lib/dal";
import { ImageStoreProvider } from "@/providers/imageStoreProvider";
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
  if (!sources || sources.length === 0) {
    return redirect(`/dashboard/${guildId}/leave`);
  }
  const source = sources[0];
  if (!source) return redirect(`/dashboard/${guildId}/leave`);
  // console.log("source", source);
  const cards = await getSourceCards(source.id);
  // console.log("cards", cards);

  return (
    <ImageStoreProvider
      initialState={{
        sourceId: source.id,
        imageCards: cards ?? [],
        selectedCard:
          cards?.findIndex((card) => card.id === source.activeCardId) === -1
            ? null
            : cards?.findIndex((card) => card.id === source.activeCardId),
      }}
    >
      {children}
    </ImageStoreProvider>
  );
}
