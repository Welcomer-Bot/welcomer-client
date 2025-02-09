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
  if (moduleName === "welcomer") {
    const reset = useWelcomerStore((state) => state.reset);
    const setContent = useWelcomerStore((state) => state.setContent);
    const setEmbeds = useWelcomerStore((state) => state.setEmbeds);


    const setActiveCardEmbedPosition = useWelcomerStore(
      (state) => state.setActiveCardEmbedPosition
    );
    useEffect(() => {
      reset();
      useWelcomerStore.setState({
        id: module?.id,
        guildId: guildId,
        channelId: module?.channelId,
        ...module,
      });
      setContent(module?.content)
      setEmbeds(module?.embeds)
      module?.activeCardToEmbedId &&
      setActiveCardEmbedPosition(
          module?.embeds.findIndex((e) => e.id === module.activeCardToEmbedId)
      );
    }, [module, guildId, reset]);
  } else if (moduleName === "leaver") {
    const reset = useLeaverStore((state) => state.reset);
    const setContent = useLeaverStore((state) => state.setContent);
    const setEmbeds = useLeaverStore((state) => state.setEmbeds);

    const setActiveCardEmbedPosition = useLeaverStore(
      (state) => state.setActiveCardEmbedPosition
    );
    useEffect(() => {
      reset();
      useLeaverStore.setState({
        id: module?.id,
        guildId: guildId,
        channelId: module?.channelId,
        ...module,
      });
      setContent(module?.content)
      setEmbeds(module?.embeds)
      module?.activeCardToEmbedId &&
        setActiveCardEmbedPosition(
          module?.embeds.findIndex((e) => e.id === module.activeCardToEmbedId)
        );
    }, [module, guildId, reset]);
  }

  return <>{children}</>;
}
