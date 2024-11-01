"use client";

import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Input } from "@nextui-org/input";
import { Switch } from "@nextui-org/switch";
import { Button } from "@nextui-org/button";
import { EmbedField } from "@prisma/client";

import { EmbedExtended } from "@/types";

export function EmbedFieldsAccordion({
  embed: { fields },
}: {
  embed: EmbedExtended;
}) {
  return (
    <>
      <Accordion>
        {fields.map((field, index) => (
          <AccordionItem key={index} title={`Field ${index + 1}`}>
            <div className="space-y-3">
              <Input
                label={"Name"}
                value={field.name}
                onValueChange={(value) => {
                  if (fields) {
                    fields[index].name = value;
                  }
                }}
              />
              <Input
                label={"Value"}
                value={field.value}
                onValueChange={(value) => {
                  if (fields) {
                    fields[index].value = value;
                  }
                }}
              />
              <Switch
                isSelected={field.inline === true}
                onValueChange={(value) => {
                  if (fields) {
                    fields[index].inline = value;
                  }
                }}
              >
                Inline
              </Switch>
            </div>
          </AccordionItem>
        ))}
      </Accordion>
      <div>
        <Button
          onClick={() => {
            if (fields) {
              fields.push({
                name: "",
                value: "",
                inline: false,
              } as EmbedField);
            }
          }}
        >
          Add Field
        </Button>
      </div>
    </>
  );
}
