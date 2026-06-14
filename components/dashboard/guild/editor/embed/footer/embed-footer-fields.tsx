import { EmbedFooterIconInput } from "./embed-footer-icon-input";
import { EmbedFooterNameInput } from "./embed-footer-text-input";

export function EmbedFooterFields({ embedIndex }: { embedIndex: number }) {
  return (
    <div className="flex flex-row space-x-4">
      <EmbedFooterNameInput embedIndex={embedIndex} />
      <EmbedFooterIconInput embedIndex={embedIndex} />
    </div>
  );
}
