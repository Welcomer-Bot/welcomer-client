"use client";
import { useWelcomerStore } from "@/state/welcomer";
import { Leaver, Welcomer } from "@prisma/client";
import { useEffect } from "react";

export default function AppInitializer({
  module,
  guildId,
  children,
}: {
  module?: Welcomer | Leaver | null;
  guildId: string;
  children: React.ReactNode;
}) {
  const reset = useWelcomerStore((state) => state.reset);
  useEffect(() => {
    reset();
    useWelcomerStore.setState({
      id: module?.id,
      guildId: guildId,
      channelId: module?.channelId,
      content: module?.content,
      ...module,
    });
  }, [module, guildId, reset]);
  return <>{children}</>;
}
