import { EmbedBodyColorInput } from "./EmbedBodyColorInput";
import { EmbedBodyDescriptionInput } from "./EmbedBodyDescription";
import { EmbedBodyTimestampInput } from "./EmbedBodyTimestampInput";
import { EmbedBodyTitleInput } from "./EmbedBodyTitle";

import { EmbedExtended } from "@/types";

export function EmbedBodyFields({ embed }: { embed: EmbedExtended }) {
  return (
    <div className="space-y-3">
      <EmbedBodyTitleInput title={embed.title} />
      <EmbedBodyDescriptionInput description={embed.description} />
      <EmbedBodyColorInput color={embed.color} />
      <EmbedBodyTimestampInput timestamp={embed.timestamp} />
    </div>
  );
}
