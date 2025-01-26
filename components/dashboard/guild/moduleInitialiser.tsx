"use client";

import { BaseCardParams, ImageCard } from "@/lib/discord/schema";
import { useImageStore } from "@/state/image";
import { useModuleNameStore } from "@/state/moduleName";
import { ModuleName } from "@/types";
import { useEffect } from "react";

export default function ModuleInitialiser({
  moduleName,
  moduleId,
  cards,
  children,
}: {
    moduleName: ModuleName;
    moduleId: number;
    cards: BaseCardParams[]|null;
  children: React.ReactNode;
}) {
  const setModuleName = useModuleNameStore((state) => state.setModuleName);
  const setModuleId = useImageStore((state) => state.setModuleId);
  const setCards = useImageStore((state) => state.setCards);
  useEffect(() => {
    setModuleName(moduleName);
    setModuleId(moduleId);
    if (cards)
      setCards(cards);
  }, []);

  return <>{children}</>;
}
