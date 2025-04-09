"use client";

import { useLeaverStore } from "@/state/leaver";
import { useWelcomerStore } from "@/state/welcomer";
import { ModuleName } from "@/types";
import { Accordion, AccordionItem } from "@heroui/accordion";
import React from "react";

export default function EmbedsAccordionWrapper({
  children,
  module,
}: {
  children: React.ReactNode;
  module: ModuleName;
}) {
  const welcomerStore = useWelcomerStore();
  const leaverStore = useLeaverStore();
  const store = module === "welcomer" ? welcomerStore : leaverStore;

  const embedsLength = store.embeds.length;

  return (
    <Accordion variant="splitted">
      <AccordionItem aria-label="Embeds" title={`Embeds (${embedsLength}/10)`}>
        {children}
      </AccordionItem>
    </Accordion>
  );
}
