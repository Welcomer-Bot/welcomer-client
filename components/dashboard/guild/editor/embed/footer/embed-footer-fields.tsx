import { EmbedFooterIconInput } from "./embed-footer-icon-input";
import { EmbedFooterNameInput } from "./embed-footer-text-input";

export function EmbedFooterFields({ embedIndex }: { embedIndex: number }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <EmbedFooterNameInput embedIndex={embedIndex} />
      <EmbedFooterIconInput embedIndex={embedIndex} />
    </div>
  );
}
