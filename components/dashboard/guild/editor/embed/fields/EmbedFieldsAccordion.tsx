"use client";

import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Switch } from "@nextui-org/switch";

import { EmbedExtended } from "@/types";

export function EmbedFieldsAccordion({ embed }: { embed: EmbedExtended }) {

  if (embed.fields?.length === 0) {
    return (
      <div>
        <Button
          onClick={() => {
            if (embed.fields) {
              embed.fields.push({
                  name: "",
                  value: "",
                  inline: false,
              });
            }
          }}
        >
          Add Field
        </Button>
      </div>
    );
  }

  return (
    <Accordion>
      {embed.fields.map((field, index) => (
        <AccordionItem key={index} title={`Field ${index + 1}`}>
          <div className="space-y-3">
            <Input
              label={"Name"}
              value={field.name}
              onValueChange={(value) => {
                if (embed.fields) {
                  embed.fields[index].name = value;
                }
              }}
            />
            <Input
              label={"Value"}
              value={field.value}
              onValueChange={(value) => {
                if (embed.fields) {
                  embed.fields[index].value = value;
                }
              }}
            />
            <Switch
              isSelected={field.inline === true}
              onValueChange={(value) => {
                if (embed.fields) {
                  embed.fields[index].inline = value;
                }
              }}
            >
              Inline
            </Switch>
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
