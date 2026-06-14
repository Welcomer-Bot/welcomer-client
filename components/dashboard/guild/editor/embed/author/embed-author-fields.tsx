import { EmbedAuthorIconInput } from "./embed-author-icon";
import { EmbedAuthorNameInput } from "./embed-author-name-input";
import { EmbedAuthorUrlInput } from "./embed-author-url";

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
