"use client";

import { useWelcomerStore } from "@/state/welcomer";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import React from "react";

export default function EmbedsFieldsAccordionWrapper({
  embedId,
  children,
}: {
  embedId: number;
  children: React.ReactNode;
}) {
  const embedsFieldLength = useWelcomerStore((state) => state.embeds[embedId].fields).length;

  return (
    <Accordion variant="shadow">
      <AccordionItem aria-label="Fields" title={`Fields (${embedsFieldLength}/25)`}>
        {children}
      </AccordionItem>
    </Accordion>
  );
}
