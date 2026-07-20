import { EmbedsFieldsAccordionWrapper } from "@/components/ui";
import { SourceStoreContext } from "@/features/dashboard/modules/providers";
import { Button } from "@heroui/button";
import { useContext } from "react";
import { FaArrowDown, FaArrowUp, FaTrash } from "react-icons/fa";
import { useStore } from "zustand";
import AddEmbedFieldsButton from "./add-embed-fields-button";
import ClearEmbedFieldsButton from "./clear-embed-fields-button";
import { EmbedFieldInlineInput } from "./embed-field-inline-input";
import { EmbedFieldNameInput } from "./embed-field-name-input";
import { EmbedFieldValueInput } from "./embed-field-value-input";

export function EmbedFieldsFields({ embedIndex }: { embedIndex: number }) {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");

  const embed = useStore(store, (state) => state.message?.embeds?.[embedIndex]);

  const fields = embed?.fields ?? [];
  const removeField = useStore(store, (state) => state.deleteField);
  const setToPrevious = useStore(store, (state) => state.moveFieldUp);
  const setToNext = useStore(store, (state) => state.moveFieldDown);

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={index} className="space-y-2">
          <EmbedsFieldsAccordionWrapper embedId={embedIndex} index={index}>
            <div className="flex flex-row-reverse space-x-reverse space-x-2 mb-2">
              <Button
                isIconOnly
                aria-label={`Delete field ${index + 1}`}
                color="danger"
                variant="ghost"
                size="sm"
                onPress={() => removeField(embedIndex, index)}
              >
                <FaTrash />
              </Button>
              <Button
                isIconOnly
                aria-label={`Move field ${index + 1} down`}
                color="default"
                size="sm"
                isDisabled={index === fields.length - 1}
                onPress={() => setToNext(embedIndex, index)}
              >
                <FaArrowDown />
              </Button>
              <Button
                isIconOnly
                aria-label={`Move field ${index + 1} up`}
                color="default"
                size="sm"
                isDisabled={index === 0}
                onPress={() => setToPrevious(embedIndex, index)}
              >
                <FaArrowUp />
              </Button>
            </div>
            <div className="space-y-2">
              <EmbedFieldNameInput embedIndex={embedIndex} fieldIndex={index} />
              <EmbedFieldValueInput
                embedIndex={embedIndex}
                fieldIndex={index}
              />
              <EmbedFieldInlineInput
                embedIndex={embedIndex}
                fieldIndex={index}
              />
            </div>
          </EmbedsFieldsAccordionWrapper>
        </div>
      ))}
      <div className="sm:flex-row flex-col flex my-5">
        <AddEmbedFieldsButton embedIndex={embedIndex} />
        <ClearEmbedFieldsButton embedIndex={embedIndex} />
      </div>
    </div>
  );
}
