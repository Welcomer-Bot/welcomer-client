import { EmbedAuthorIconInput } from "./EmbedAuthorIcon";
import { EmbedAuthorNameInput } from "./EmbedAuthorNameInput";
import { EmbedAuthorUrlInput } from "./EmbedAuthorUrl";

export function EmbedAuthorFields({ embedIndex }: { embedIndex: number }) {
  return (
    <div className="space-y-3">
      <EmbedAuthorNameInput embedIndex={embedIndex} />
      <div className="flex flex-row space-x-4">
        <EmbedAuthorIconInput embedIndex={embedIndex} />
        <EmbedAuthorUrlInput embedIndex={embedIndex} />
      </div>
    </div>
  );
}
