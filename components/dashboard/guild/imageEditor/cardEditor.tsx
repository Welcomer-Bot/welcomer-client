"use client";

import { useImageStore } from "@/state/image";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { ImageBackgroundFields } from "./background/ImageBackgroundFields";
import { ImageTextFields } from "./text/ImageTextFields";

export function CardEditor() {
  const currentCard = useImageStore((state) => state.getActiveCard());

  if (!currentCard)
    return (
      <div className="text-white w-full text-center">No card selected</div>
    );

  return (
    <form className="px-5 pt-5 pb-20 space-y-5 w-full relative">
      <Accordion variant="bordered">
        <AccordionItem title="Main Text" aria-label="Main Text">
          <ImageTextFields textType="mainText" />
        </AccordionItem>
        <AccordionItem title="Second Text" aria-label="Second Text">
          <ImageTextFields textType="secondText" />
        </AccordionItem>
        <AccordionItem title="Background options" aria-label="Background">
          <ImageBackgroundFields />
        </AccordionItem>
      </Accordion>
    </form>
  );
}
