"use client";

import { useImageStore } from "@/state/image";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { ImageBackgroundFields } from "./background/ImageBackgroundFields";
import { ImageTextFields } from "./text/ImageTextFields";
import { useModuleNameStore } from "@/state/moduleName";

export function CardEditor() {
  const currentCard = useImageStore((state) => state.getActiveCard());
  const moduleName = useModuleNameStore((state) => state.moduleName);

  if (!currentCard)
    return (
      <div className="text-white w-full text-center">No card selected</div>
    );

  return (
    <>
      {/* <form className="px-5 pt-5 pb-20 space-y-5 w-full relative"> */}
      <h1 className="mb-3">Edit {moduleName} card</h1>
      <Accordion variant="bordered">
        <AccordionItem title="Main Text" aria-label="Main Text">
          <ImageTextFields textType="mainText" />
        </AccordionItem>
        <AccordionItem title="Second Text" aria-label="Second Text">
          <ImageTextFields textType="secondText" />
        </AccordionItem>
        <AccordionItem title="Nickname Text" aria-label="Nickname Text">
          <ImageTextFields textType="nicknameText" />
        </AccordionItem>
        <AccordionItem title="Background options" aria-label="Background">
          <ImageBackgroundFields />
        </AccordionItem>
      </Accordion>
      {/* </form> */}
    </>
  );
}
