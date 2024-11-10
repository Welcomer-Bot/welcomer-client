"use client";

import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { useWelcomerStore } from "@/state/welcomer";
import { EmbedBodyFields } from "./body/EmbedBodyFields";
import { EmbedAuthorFields } from "./author/EmbedAuthorFields";
import { EmbedFooterFields } from "./footer/EmbedFooterFields";

export default function EmbedsViewer() {
  const embeds = useWelcomerStore((state) => state.embeds);

  return (
    <div>
      <Accordion variant="splitted">
        {embeds.map((embed, index) => (
          <AccordionItem
            key={index}
            aria-label={`Embed ${index + 1}`}
            title={
              <div>
                {`Embed ${index + 1} -`}
                <span className="text-gray-500"> {embed.title ?? ""}</span>
              </div>
              }
          >
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
              <AccordionItem key={5} aria-label="Fields" title="Fields">
                {/* <EmbedFieldsAccordion embed={embed} /> */}
              </AccordionItem>
            </Accordion>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

