"use client";

import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Button } from "@heroui/button";
import { FaArrowDown, FaArrowUp, FaTrash } from "react-icons/fa";
import { EmbedAuthorFields } from "./author/EmbedAuthorFields";
import { EmbedBodyFields } from "./body/EmbedBodyFields";
import { EmbedFieldsFields } from "./fields/EmbedsFieldsFields";
import { EmbedFooterFields } from "./footer/EmbedFooterFields";

export default function EmbedsViewer() {
  const module = useModuleNameStore((state) => state.moduleName);
  const store = module === "welcomer" ? useWelcomerStore : useLeaverStore;
  const embeds = store().embeds;
  const removeEmbed = store().removeEmbed;
  const setToPrevious = store().setToPreviousEmbed;
  const setToNext = store().setToNextEmbed;

  return (
    <>
      {embeds.map((embed, index) => (
        <Accordion variant="splitted" key={index}>
          <AccordionItem
            aria-label={`Embed ${index + 1}`}
            title={`Embed ${index + 1}`}
            subtitle={embed.title}
          >
            <div className="flex flex-row-reverse space-x-reverse space-x-2 mb-2">
              <Button
                isIconOnly
                color="danger"
                variant="ghost"
                size="sm"
                onPress={() => removeEmbed(index)}
              >
                <FaTrash />
              </Button>
              <Button
                isIconOnly
                color="default"
                size="sm"
                isDisabled={index === embeds.length - 1}
                onPress={() => setToNext(index)}
              >
                <FaArrowDown />
              </Button>
              <Button
                isIconOnly
                color="default"
                size="sm"
                isDisabled={index === 0}
                onPress={() => setToPrevious(index)}
              >
                <FaArrowUp />
              </Button>
            </div>
            <Accordion
              defaultSelectedKeys={"all"}
              selectionMode="multiple"
              variant="bordered"
            >
              <AccordionItem key={1} aria-label="Author" title="Author">
                <EmbedAuthorFields embedIndex={index} />
              </AccordionItem>
              <AccordionItem key={2} aria-label="Body" title="Body">
                <EmbedBodyFields embedIndex={index} />
              </AccordionItem>
              <AccordionItem key={3} aria-label="Footer" title="Footer">
                <EmbedFooterFields embedIndex={index} />
              </AccordionItem>
              <AccordionItem key={4} aria-label="Images" title="Images">
                Images
              </AccordionItem>
              <AccordionItem
                key={5}
                aria-label="Fields"
                title={`Fields (${embed.fields.length}/25)`}
              >
                <EmbedFieldsFields embedIndex={index} />
              </AccordionItem>
            </Accordion>
          </AccordionItem>
        </Accordion>
      ))}
    </>
  );
}
