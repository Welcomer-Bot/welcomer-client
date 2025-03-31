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
  const resetWelcomer = useWelcomerStore((state) => state.reset);
  const resetLeaver = useLeaverStore((state) => state.reset);

  useEffect(() => {
    setModuleName(moduleName);
  }, [moduleName, setModuleName]);

  useEffect(() => {
    console.log("App Initializer", moduleName, module);
    if (moduleName === "welcomer") {
      resetWelcomer();
      useWelcomerStore.setState((state) => {
        state.guildId = guildId;
        state.activeCardId = module?.activeCardId;
        state.activeCardToEmbedId = module?.embeds.findIndex(
          (e) => e.id === module.activeCardToEmbedId
        );
        state.channelId = module?.channelId;
        state.activeCard = module?.activeCard;
        if (module?.content) {
          state.content = module.content;
        } else {
          state.content = null;
        }
        if (module?.embeds && module.embeds.length > 0) {
          state.embeds = module.embeds;
        } else {
          state.embeds = [];
        }
      });
    } else if (moduleName === "leaver") {
      resetLeaver();
      useLeaverStore.setState((state) => {
        state.guildId = guildId;
        state.channelId = module?.channelId;
        state.activeCardId = module?.activeCardId;
        state.activeCard = module?.activeCard;
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
    }
  }, [module, guildId, moduleName, resetWelcomer, resetLeaver]);

  return <>{children}</>;
}
