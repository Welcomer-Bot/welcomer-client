import { EmbedFooterIconInput } from "./EmbedFooterIconInput";
import { EmbedFooterNameInput } from "./EmbedFooterTextInput";

export function EmbedFooterFields({ embedIndex }: { embedIndex: number }) {
  return (
    <div className="flex flex-row space-x-4">
      <EmbedFooterNameInput embedIndex={embedIndex} />
      <EmbedFooterIconInput embedIndex={embedIndex} />
    </div>
  );
}
