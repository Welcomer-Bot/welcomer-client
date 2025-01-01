import EmbedsFieldsAccordionWrapper from "@/components/Accordion/EmbedsFieldsAccordionWrapper";
import { useWelcomerStore } from "@/state/welcomer";
import AddEmbedFieldsButton from "./AddEmbedFieldsButton";
import ClearEmbedFieldsButton from "./ClearEmbedFieldsButton";
import { EmbedFieldInlineInput } from "./EmbedFieldInlineInput";
import { EmbedFieldNameInput } from "./EmbedFieldNameInput";
import { EmbedFieldValueInput } from "./EmbedFieldValueInput";

export function EmbedFieldsFields({ embedIndex }: { embedIndex: number }) {
  const fields = useWelcomerStore((state) => state.embeds[embedIndex].fields);

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={index} className="space-y-2">
          <EmbedsFieldsAccordionWrapper embedId={embedIndex} index={index}>
            <div className="space-y-2">
            <EmbedFieldNameInput embedIndex={embedIndex} fieldIndex={index} />
            <EmbedFieldValueInput embedIndex={embedIndex} fieldIndex={index} />
            <EmbedFieldInlineInput embedIndex={embedIndex} fieldIndex={index} />
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
