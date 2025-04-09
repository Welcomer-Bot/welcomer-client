import { ModuleName } from "@/types";
import { EmbedFooterIconInput } from "./EmbedFooterIconInput";
import { EmbedFooterNameInput } from "./EmbedFooterTextInput";

export function EmbedFooterFields({ module, embedIndex }: { module:ModuleName, embedIndex: number }) {
  return (
    <div className="flex flex-row space-x-4">
      <EmbedFooterNameInput embedIndex={embedIndex} module={module} />
      <EmbedFooterIconInput embedIndex={embedIndex} module={module} />
    </div>
  );
}
