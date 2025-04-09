"use client";

import { BaseCardParams } from "@/lib/discord/schema";
import { useImageStore } from "@/state/image";
import { ModuleName } from "@/types";
import { useEffect } from "react";

export default function ModuleInitialiser({
  moduleName,
  moduleId,
  cards,
  children,
  activeCardId,
}: {
  moduleName: ModuleName;
  moduleId: string;
  cards: BaseCardParams[] | null;
  activeCardId?: number | null;
  children: React.ReactNode;
}) {
  const setModuleId = useImageStore((state) => state.setModuleId);
  const setCards = useImageStore((state) => state.setCards);
  const setActiveCardId = useImageStore((state) => state.setActiveCardId);
  useImageStore()
  useEffect(() => {
    setModuleId(moduleId);
    if (cards) setCards(cards);
    if (activeCardId) setActiveCardId(activeCardId);
  }, [setModuleId, setCards, setActiveCardId, moduleName, moduleId, cards, activeCardId]);

  return <>{children}</>;
}
