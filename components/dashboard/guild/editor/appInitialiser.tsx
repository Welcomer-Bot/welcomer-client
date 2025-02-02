"use client";
import { CompleteLeaver, CompleteWelcomer } from "@/prisma/schema";
import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";
import { ModuleName } from "@/types";
import { useEffect } from "react";

export default function AppInitializer({
  module,
  moduleName,
  guildId,
  children,
}: {
  module?: CompleteWelcomer | CompleteLeaver | null;
  moduleName: ModuleName;
  guildId: string;
  children: React.ReactNode;
}) {
  const setModuleName = useModuleNameStore((state) => state.setModuleName);
  useEffect(() => {
    setModuleName(moduleName);
  });
  // console.log(module)
  if (moduleName === "welcomer") {
    const reset = useWelcomerStore((state) => state.reset);
    const setActiveCardEmbedPosition = useWelcomerStore(
      (state) => state.setActiveCardEmbedPosition
    );
    useEffect(() => {
      reset();
      useWelcomerStore.setState({
        id: module?.id,
        guildId: guildId,
        channelId: module?.channelId,
        content: module?.content,
        ...module,
      });
      module?.activeCardToEmbedId &&
      setActiveCardEmbedPosition(
          module?.embeds.findIndex((e) => e.id === module.activeCardToEmbedId)
      );
    }, [module, guildId, reset]);
  } else if (moduleName === "leaver") {
    const reset = useLeaverStore((state) => state.reset);
    const setActiveCardEmbedPosition = useLeaverStore(
      (state) => state.setActiveCardEmbedPosition
    );
    useEffect(() => {
      reset();
      useLeaverStore.setState({
        id: module?.id,
        guildId: guildId,
        channelId: module?.channelId,
        content: module?.content,
        ...module,
      });

      module?.activeCardToEmbedId &&
        setActiveCardEmbedPosition(
          module?.embeds.findIndex((e) => e.id === module.activeCardToEmbedId)
        );
    }, [module, guildId, reset]);
  }

  return <>{children}</>;
}
