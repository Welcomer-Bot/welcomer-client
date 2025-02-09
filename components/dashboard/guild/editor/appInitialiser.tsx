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

    const setActiveCardEmbedPosition = useWelcomerStore(
      (state) => state.setActiveCardEmbedPosition
    );
    useEffect(() => {
      reset();
      useWelcomerStore.setState((state) => {
        state.id = module?.id;
        state.guildId = guildId;
        state.activeCardId = module?.activeCardId;
        state.activeCardToEmbedId = module?.activeCardToEmbedId;
        state.channelId = module?.channelId;
        if (module?.content) {
          state.content = module.content;
        }
        if (module?.embeds && module.embeds.length > 0) {
          state.embeds = module.embeds;
        }
        if (module?.activeCardToEmbedId) {
          setActiveCardEmbedPosition(
            module.embeds.findIndex((e) => e.id === module.activeCardToEmbedId)
          );
        }
      });
    }, [module, guildId, reset]);
  } else if (moduleName === "leaver") {
    const reset = useLeaverStore((state) => state.reset);

    const setActiveCardEmbedPosition = useLeaverStore(
      (state) => state.setActiveCardEmbedPosition
    );
    useEffect(() => {
      reset();
      useLeaverStore.setState((state) => {
        state.id = module?.id;
        state.guildId = guildId;
        state.channelId = module?.channelId;
        state.activeCardId = module?.activeCardId;
        state.activeCardToEmbedId = module?.activeCardToEmbedId;
        if (module?.content) {
          state.content = module.content;
        }
        if (module?.embeds && module.embeds.length > 0) {
          state.embeds = module.embeds;
        }
        if (module?.activeCardToEmbedId) {
          setActiveCardEmbedPosition(
            module.embeds.findIndex((e) => e.id === module.activeCardToEmbedId)
          );
        }
      });
    }, [module, guildId, reset]);
  }

  return <>{children}</>;
}
