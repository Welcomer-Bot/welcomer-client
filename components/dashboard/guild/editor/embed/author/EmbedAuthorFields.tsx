import { EmbedAuthorIconInput } from "./EmbedAuthorIcon";
import { EmbedAuthorNameInput } from "./EmbedAuthorNameInput";
import { EmbedAuthorUrlInput } from "./EmbedAuthorUrl";

import { EmbedExtended } from "@/types";

export function EmbedAuthorFields() {
  return (
    <div className="space-y-3">
      <EmbedAuthorNameInput name={embed.author?.name} />
      <div className="flex flex-row space-x-4">
        <EmbedAuthorIconInput icon={embed.author?.iconUrl} />
        <EmbedAuthorUrlInput url={embed.author?.url} />
      </div>
    </div>
  );
}
