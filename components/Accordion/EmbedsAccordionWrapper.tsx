"use client";

import { useEmbedsStore } from "@/state/embeds";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import React from "react";

export default function EmbedsAccordionWrapper({
  children,
}: {
  children: React.ReactNode;
  }) {
  const embedsLength = useEmbedsStore((state) => state.embeds).length;
  
  return (
    <Accordion>
      <AccordionItem title={`Embeds (${embedsLength}/10)`}>
        {children}
      </AccordionItem>
    </Accordion>
  );
}
