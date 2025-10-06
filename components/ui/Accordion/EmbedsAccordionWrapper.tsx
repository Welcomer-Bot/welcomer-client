// client - uses useContext and useStore hooks
"use client";

import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Accordion, AccordionItem } from "@heroui/accordion";
import React, { useContext } from "react";
import { useStore } from "zustand";

export default function EmbedsAccordionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const embedsLength = useStore(store, (state) => (state.message?.embeds?.length) || 0);
  return (
    <Accordion variant="splitted">
      <AccordionItem aria-label="Embeds" title={`Embeds (${embedsLength}/10)`}>
        {children}
      </AccordionItem>
    </Accordion>
  );
}
