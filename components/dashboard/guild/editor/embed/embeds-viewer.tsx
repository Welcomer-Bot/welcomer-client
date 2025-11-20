"use client";

import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Button } from "@heroui/button";
import { useContext } from "react";
import { FaArrowDown, FaArrowUp, FaTrash } from "react-icons/fa";
import { useStore } from "zustand";
import { EmbedAuthorFields } from "./author/embed-author-fields";
import { EmbedBodyFields } from "./body/embed-body-fields";
import { EmbedFieldsFields } from "./fields/embeds-fields-fields";
import { EmbedFooterFields } from "./footer/embed-footer-fields";

export default function EmbedsViewer() {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const embeds = useStore(store, (state) => state.message?.embeds) || [];
  const removeEmbed = useStore(store, (state) => state.deleteEmbed);
  const setToPrevious = useStore(store, (state) => state.moveEmbedUp);
  const setToNext = useStore(store, (state) => state.moveEmbedDown);

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
                title={`Fields (${embed.fields?.length || 0}/25)`}
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
