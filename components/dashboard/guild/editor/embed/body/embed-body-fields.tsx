import { EmbedBodyColorInput } from "./embed-body-color-input";
import { EmbedBodyDescriptionInput } from "./embed-body-description";
import { EmbedBodyTitleInput } from "./embed-body-title";

export function EmbedBodyFields({ embedIndex }: { embedIndex: number }) {
  return (
    <div className="space-y-3">
      <EmbedBodyTitleInput embedIndex={embedIndex} />
      <EmbedBodyDescriptionInput embedIndex={embedIndex} />
      <EmbedBodyColorInput embedIndex={embedIndex} />
    </div>
  );
}
