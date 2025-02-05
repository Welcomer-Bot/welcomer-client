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
  const module = useModuleNameStore((state) => state.moduleName);
  const store = module === "welcomer" ? useWelcomerStore() : useLeaverStore();
  const embedsLength = store.embeds.length;

  return (
    <Accordion variant="splitted">
      <AccordionItem aria-label="Embeds" title={`Embeds (${embedsLength}/10)`}>
        {children}
      </AccordionItem>
    </Accordion>
  );
}
