"use client";
import { useLeaverStore } from "@/state/leaver";
import { useModuleStore } from "@/state/module";
import { useWelcomerStore } from "@/state/welcomer";
import { Leaver, Welcomer } from "@prisma/client";
import { useEffect } from "react";

export default function AppInitializer({
  module,
  moduleName,
  guildId,
  children,
}: {
  module?: Welcomer | Leaver | null;
  moduleName: "welcomer" | "leaver";
  guildId: string;
  children: React.ReactNode;
}) {
  if (moduleName === "welcomer") {
    useModuleStore.setState({ moduleName: "welcomer" });
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
  } else if (moduleName === "leaver") {
    useModuleStore.setState({ moduleName: "leaver" });
    const reset = useLeaverStore((state) => state.reset);
    useEffect(() => {
      reset();
      useLeaverStore.setState({
        id: module?.id,
        guildId: guildId,
        channelId: module?.channelId,
        content: module?.content,
        ...module,
      });
    }, [module, guildId, reset]);
  }

  return <>{children}</>;
}
