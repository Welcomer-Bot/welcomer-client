import EmbedsFieldsAccordionWrapper from "@/components/Accordion/EmbedsFieldsAccordionWrapper";
import { useWelcomerStore } from "@/state/welcomer";
import AddEmbedFieldsButton from "./AddEmbedFieldsButton";
import ClearEmbedFieldsButton from "./ClearEmbedFieldsButton";
import { AccordionItem } from "@nextui-org/accordion";

export function EmbedFieldsFields({ embedIndex }: { embedIndex: number }) {
  const fields = useWelcomerStore((state) => state.embeds[embedIndex].fields);

  return (
    <>
        {fields.map((field, index) => (
            <p key={index}>
                <EmbedsFieldsAccordionWrapper embedId={embedIndex}>
                {`Field ${index + 1} -`}
                <span className="text-gray-500"> {field.name ?? ""}</span>
                </EmbedsFieldsAccordionWrapper>
          </p>
        ))}
      <div className="sm:flex-row flex-col flex my-5">
        <AddEmbedFieldsButton embedIndex={embedIndex} />
        <ClearEmbedFieldsButton embedIndex={embedIndex} />
      </div>
    </>
  );
}
