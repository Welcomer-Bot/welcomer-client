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
  const sources = await getSources(guildId, "Welcomer");
  //TODO: handle multiple sources and sources selection
  return (
    <SourceStoreProvider initialState={sources && sources[0] ? sources[0] as CompleteSource : undefined}>
      {children}
    </SourceStoreProvider>
  );
}
