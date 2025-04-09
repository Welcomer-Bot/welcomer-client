"use client";

import { useImageStore } from "@/state/image";
import { ModuleName } from "@/types";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { ImageBackgroundFields } from "./background/ImageBackgroundFields";
import { ImageTextFields } from "./text/ImageTextFields";

export function CardEditor({ module }: { module: ModuleName }) {
  const currentCard = useImageStore((state) => state.getActiveCard());

  if (!currentCard)
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
