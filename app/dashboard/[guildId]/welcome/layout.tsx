import { getSources } from "@/lib/dal";
import { SourceStoreProvider } from "@/providers/sourceStoreProvider";
import { Source } from "../../../../generated/prisma/client";

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
      initialState={
        sources && sources[0]
          ? (sources[0] as Source)
          : {
              guildId: guildId,
            }
      }
    >
      {children}
    </SourceStoreProvider>
  );
}
