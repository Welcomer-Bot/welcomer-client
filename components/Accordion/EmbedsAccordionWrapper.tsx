"use client";

import { useWelcomerStore } from "@/state/welcomer";
import { Accordion, AccordionItem } from "@heroui/accordion";
import React from "react";

export default function EmbedsAccordionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const embedsLength = useWelcomerStore((state) => state.embeds).length;

  return (
    <Accordion variant="splitted">
      <AccordionItem aria-label="Embeds" title={`Embeds (${embedsLength}/10)`}>
        {children}
      </AccordionItem>
    </Accordion>
  );
}
