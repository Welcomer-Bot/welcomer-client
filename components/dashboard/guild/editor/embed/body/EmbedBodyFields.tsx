import { EmbedBodyColorInput } from "./EmbedBodyColorInput";
import { EmbedBodyDescriptionInput } from "./EmbedBodyDescription";
import { EmbedBodyTitleInput } from "./EmbedBodyTitle";

// TODO: reimplement timestamp input

export function EmbedBodyFields({
  embedIndex,
}: {
  embedIndex: number;
}) {
  return (
    <div className="space-y-3">
      <EmbedBodyTitleInput embedIndex={embedIndex} />
      <EmbedBodyDescriptionInput embedIndex={embedIndex}/>
      <EmbedBodyColorInput embedIndex={embedIndex} />
    </div>
  );
}
