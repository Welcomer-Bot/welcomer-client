"use client";

import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";
import { Accordion, AccordionItem } from "@heroui/accordion";
import React from "react";

export default function EmbedsAccordionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentModuleName = useModuleNameStore((state) => state.moduleName);
  const welcomerStore = useWelcomerStore();
  const leaverStore = useLeaverStore();
  const store = currentModuleName === "welcomer" ? welcomerStore : leaverStore;
  const embedsLength = store.embeds.length;

  return (
    <Accordion variant="splitted">
      <AccordionItem aria-label="Embeds" title={`Embeds (${embedsLength}/10)`}>
        {children}
      </AccordionItem>
    </Accordion>
  );
}
