import { getSources } from "@/lib/dal";
import { Source } from "@/prisma/generated/client";
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
  console.log("sources", sources);
  //TODO: handle multiple sources and sources selection
  return (
    <SourceStoreProvider
      initialState={sources && sources[0] ? (sources[0] as Source) : undefined}
    >
      {children}
    </SourceStoreProvider>
  );
}
