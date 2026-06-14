"use client";

import { Accordion, AccordionItem } from "@heroui/accordion";
import React from "react";

export default function EmbedsFieldsAccordionWrapper({
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
