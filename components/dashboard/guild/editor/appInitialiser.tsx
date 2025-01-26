"use client";
import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";
import { ModuleName } from "@/types";
import { Leaver, Welcomer } from "@prisma/client";
import { useEffect } from "react";

export default function AppInitializer({
  module,
  moduleName,
  guildId,
  children,
}: {
  module?: Welcomer | Leaver | null;
  moduleName: ModuleName;
  guildId: string;
  children: React.ReactNode;
}) {
  const setModuleName = useModuleNameStore((state) => state.setModuleName);
  useEffect(() => {
    setModuleName(moduleName);
  });
  if (moduleName === "welcomer") {
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
