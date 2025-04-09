import EmbedsFieldsAccordionWrapper from "@/components/Accordion/EmbedsFieldsAccordionWrapper";
import { useLeaverStore } from "@/state/leaver";
import { useWelcomerStore } from "@/state/welcomer";
import { ModuleName } from "@/types";
import { Button } from "@heroui/button";
import { FaArrowDown, FaArrowUp, FaTrash } from "react-icons/fa";
import AddEmbedFieldsButton from "./AddEmbedFieldsButton";
import ClearEmbedFieldsButton from "./ClearEmbedFieldsButton";
import { EmbedFieldInlineInput } from "./EmbedFieldInlineInput";
import { EmbedFieldNameInput } from "./EmbedFieldNameInput";
import { EmbedFieldValueInput } from "./EmbedFieldValueInput";

export function EmbedFieldsFields({
  embedIndex,
  module,
}: {
  embedIndex: number;
  module: ModuleName;
}) {
  const store = module === "welcomer" ? useWelcomerStore() : useLeaverStore();

  const fields = store.embeds[embedIndex].fields;
  const removeField = store.removeField;
  const setToPrevious = store.setToPreviousField;
  const setToNext = store.setToNextField;

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={index} className="space-y-2">
          <EmbedsFieldsAccordionWrapper embedId={embedIndex} index={index}>
            <div className="flex flex-row-reverse space-x-reverse space-x-2 mb-2">
              <Button
                isIconOnly
                color="danger"
                variant="ghost"
                size="sm"
                onPress={() => removeField(embedIndex, index)}
              >
                <FaTrash />
              </Button>
              <Button
                isIconOnly
                color="default"
                size="sm"
                isDisabled={index === fields.length - 1}
                onPress={() => setToNext(embedIndex, index)}
              >
                <FaArrowDown />
              </Button>
              <Button
                isIconOnly
                color="default"
                size="sm"
                isDisabled={index === 0}
                onPress={() => setToPrevious(embedIndex, index)}
              >
                <FaArrowUp />
              </Button>
            </div>
            <div className="space-y-2">
              <EmbedFieldNameInput
                embedIndex={embedIndex}
                fieldIndex={index}
                module={module}
              />
              <EmbedFieldValueInput
                embedIndex={embedIndex}
                fieldIndex={index}
                module={module}
              />
              <EmbedFieldInlineInput
                embedIndex={embedIndex}
                fieldIndex={index}
                module={module}
              />
            </div>
          </EmbedsFieldsAccordionWrapper>
        </div>
      ))}
      <div className="sm:flex-row flex-col flex my-5">
        <AddEmbedFieldsButton embedIndex={embedIndex} module={module} />
        <ClearEmbedFieldsButton embedIndex={embedIndex} />
      </div>
    </div>
  );
}
