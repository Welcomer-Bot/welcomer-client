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
    useEffect(() => {
      reset();
      useWelcomerStore.setState((state) => {
        state.id = module?.id;
        state.guildId = guildId;
        state.activeCardId = module?.activeCardId;
        state.activeCardToEmbedId = module?.embeds.findIndex(
          (e) => e.id === module.activeCardToEmbedId
        );
        state.channelId = module?.channelId;
        state.activeCard = module?.activeCard;
        if (module?.content) {
          state.content = module.content;
        }
        if (module?.embeds && module.embeds.length > 0) {
          state.embeds = module.embeds;
        }
      });
    }, [module, guildId, reset]);
  } else if (moduleName === "leaver") {
    const reset = useLeaverStore((state) => state.reset);

    useEffect(() => {
      reset();
      useLeaverStore.setState((state) => {
        state.id = module?.id;
        state.guildId = guildId;
        state.channelId = module?.channelId;
        state.activeCardId = module?.activeCardId;
        state.activeCardToEmbedId = module?.embeds.findIndex(
          (e) => e.id === module.activeCardToEmbedId
        );
        if (module?.content) {
          state.content = module.content;
        }
        if (module?.embeds && module.embeds.length > 0) {
          state.embeds = module.embeds;
        }
      });
    }, [module, guildId, reset]);
  }

  return <>{children}</>;
}
