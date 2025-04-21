import EmbedsFieldsAccordionWrapper from "@/components/Accordion/EmbedsFieldsAccordionWrapper";
import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Button } from "@heroui/button";
import { useContext } from "react";
import { FaArrowDown, FaArrowUp, FaTrash } from "react-icons/fa";
import { useStore } from "zustand";
import AddEmbedFieldsButton from "./AddEmbedFieldsButton";
import ClearEmbedFieldsButton from "./ClearEmbedFieldsButton";
import { EmbedFieldInlineInput } from "./EmbedFieldInlineInput";
import { EmbedFieldNameInput } from "./EmbedFieldNameInput";
import { EmbedFieldValueInput } from "./EmbedFieldValueInput";

export function EmbedFieldsFields({ embedIndex }: { embedIndex: number }) {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const fields = useStore(store, (state) => state.embeds[embedIndex].fields);
  const removeField = useStore(store, (state) => state.removeField);
  const setToPrevious = useStore(store, (state) => state.setToPreviousField);
  const setToNext = useStore(store, (state) => state.setToNextField);

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
              />
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
