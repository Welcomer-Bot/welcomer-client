"use client";

import { AccordionItem } from "@heroui/accordion";
import React from "react";

export default function AccordionItemWrapper({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <AccordionItem title aria-label={title}>
      {children}
    </AccordionItem>
  );
}
