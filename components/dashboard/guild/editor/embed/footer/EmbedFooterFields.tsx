import { EmbedFooterIconInput } from "./EmbedFooterIconInput";
import { EmbedFooterTextInput } from "./EmbedFooterText";

import { EmbedExtended } from "@/types";

export function EmbedFooterFields({ embed }: { embed: EmbedExtended }) {
  return (
    <div className="space-y-3">
      <EmbedFooterTextInput text={embed.footer?.text} />
      <EmbedFooterIconInput icon={embed.footer?.iconUrl} />
    </div>
  );
}
