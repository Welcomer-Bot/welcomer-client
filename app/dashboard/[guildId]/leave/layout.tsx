import { getSources } from "@/lib/dal";
import { CompleteSource } from "@/prisma/schema";
import { SourceStoreProvider } from "@/providers/sourceStoreProvider";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const source = await getSources(guildId, "Leaver");
  console.log("sources", source);

  //TODO: handle multiple source and source selection
  return (
    <SourceStoreProvider initialState={source && source[0] ? source[0] as CompleteSource : undefined}>
      {children}
    </SourceStoreProvider>
  );
}
