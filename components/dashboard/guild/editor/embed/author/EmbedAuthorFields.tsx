import { ModuleName } from "@/types";
import { EmbedAuthorIconInput } from "./EmbedAuthorIcon";
import { EmbedAuthorNameInput } from "./EmbedAuthorNameInput";
import { EmbedAuthorUrlInput } from "./EmbedAuthorUrl";

export function EmbedAuthorFields({module, embedIndex }: {module: ModuleName, embedIndex: number }) {
  return (
    <div className="space-y-3">
      <EmbedAuthorNameInput embedIndex={embedIndex} module={module} />
      <div className="flex flex-row space-x-4">
        <EmbedAuthorIconInput embedIndex={embedIndex} module={module} />
        <EmbedAuthorUrlInput embedIndex={embedIndex} module={module} />
      </div>
    </div>
  );
}
