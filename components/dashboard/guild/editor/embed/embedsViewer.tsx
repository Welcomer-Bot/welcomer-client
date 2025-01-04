"use client";

import { useWelcomerStore } from "@/state/welcomer";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Button } from "@nextui-org/button";
import { FaTrash } from "react-icons/fa";
import { EmbedAuthorFields } from "./author/EmbedAuthorFields";
import { EmbedBodyFields } from "./body/EmbedBodyFields";
import { EmbedFieldsFields } from "./fields/EmbedsFieldsFields";
import { EmbedFooterFields } from "./footer/EmbedFooterFields";

export default function EmbedsViewer() {
  const embeds = useWelcomerStore((state) => state.embeds);
  const removeEmbed = useWelcomerStore((state) => state.removeEmbed);

  return (
    <>
      {embeds.map((embed, index) => (
        <Accordion variant="splitted" key={index}>
          <AccordionItem
            aria-label={`Embed ${index + 1}`}
            title={`Embed ${index + 1}`}
            subtitle={embed.title}
          >
            <div className="relative w-full mb-5 ml-auto right-0">
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
                color="danger"
                variant="ghost"
                size="sm"
                onPress={() => removeEmbed(index)}
              >
                <FaTrash />
              </Button>
              <Button
                isIconOnly
                color="danger"
                variant="ghost"
                size="sm"
                onPress={() => removeEmbed(index)}
              >
                <FaTrash />
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
