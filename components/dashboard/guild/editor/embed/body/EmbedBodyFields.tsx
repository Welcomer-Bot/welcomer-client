import { EmbedBodyColorInput } from "./EmbedBodyColorInput";
import { EmbedBodyDescriptionInput } from "./EmbedBodyDescription";
import { EmbedBodyTimestampInput } from "./EmbedBodyTimestampInput";
import { EmbedBodyTitleInput } from "./EmbedBodyTitle";

export function EmbedBodyFields({ embedIndex }: { embedIndex: number }) {
  return (
    <div className="space-y-3">
      <EmbedBodyTitleInput embedIndex={embedIndex} />
      <EmbedBodyDescriptionInput embedIndex={embedIndex} />
      <EmbedBodyColorInput embedIndex={embedIndex} />
      <EmbedBodyTimestampInput embedIndex={embedIndex} />
    </div>
  );
}
