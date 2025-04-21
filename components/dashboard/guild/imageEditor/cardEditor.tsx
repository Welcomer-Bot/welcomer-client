"use client";

import { ImageStoreContext } from "@/providers/imageStoreProvider";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { SourceType } from "@prisma/client";
import { useContext } from "react";
import { useStore } from "zustand";
import { ImageBackgroundFields } from "./background/ImageBackgroundFields";
import { ImageTextFields } from "./text/ImageTextFields";

export function CardEditor({ module }: { module: SourceType }) {
  const store = useContext(ImageStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const currentCard = useStore(store, (state) => state.selectedCard);
  if (currentCard === null)
    return (
      <div className="text-white w-full text-center">No card selected</div>
    );

  return (
    <>
      <h1 className="mb-3">Edit {module} card</h1>
      <Accordion
        variant="bordered"
        aria-label="accordion"
        defaultSelectedKeys={"all"}
      >
        <AccordionItem title="Main Text" aria-label="Main Text" key={1}>
          <ImageTextFields textType="mainText" />
        </AccordionItem>
        <AccordionItem title="Second Text" aria-label="Second Text" key={2}>
          <ImageTextFields textType="secondText" />
        </AccordionItem>
        <AccordionItem title="Nickname Text" aria-label="Nickname Text" key={3}>
          <ImageTextFields textType="nicknameText" />
        </AccordionItem>
        <AccordionItem
          title="Background options"
          aria-label="Background"
          key={4}
        >
          <ImageBackgroundFields />
        </AccordionItem>
      </Accordion>
    </>
  );
}
