"use client";

import { useWelcomerStore } from "@/state/welcomer";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import React from "react";

export default function EmbedsFieldsAccordionWrapper({
  embedId,
  index,
  children,
}: {
    embedId: number;
    index: number;
  children: React.ReactNode;
}) {
  return (
    <Accordion variant="splitted" className="space-y-2">
      <AccordionItem aria-label="Fields" title={`Fields - ${index + 1}`}>
        {children}
      </AccordionItem>
    </Accordion>
  );
}
