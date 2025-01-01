"use client";
import { useWelcomerStore } from "@/state/welcomer";
import { Leaver, Welcomer } from "@prisma/client";

export default function AppInitializer({
  module,
  guildId,
  children,
}: {
    module?: Welcomer | Leaver | null;
    guildId: string;
  children: React.ReactNode;
}) {
  
  const welcomerStore = useWelcomerStore((state) => state.id);
  if (!welcomerStore) {
    useWelcomerStore.setState({
      id: module?.id,
      guildId: guildId,
      channelId: module?.channelId,
      content: module?.content,
    });
  }
  return <>{children}</>;
}
