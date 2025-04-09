import { ModuleName } from "@/types";
import { EmbedBodyColorInput } from "./EmbedBodyColorInput";
import { EmbedBodyDescriptionInput } from "./EmbedBodyDescription";
import { EmbedBodyTimestampInput } from "./EmbedBodyTimestampInput";
import { EmbedBodyTitleInput } from "./EmbedBodyTitle";

export function EmbedBodyFields({module, embedIndex }: {module: ModuleName, embedIndex: number }) {
  return (
    <div className="space-y-3">
      <EmbedBodyTitleInput embedIndex={embedIndex} module={module} />
      <EmbedBodyDescriptionInput embedIndex={embedIndex} module={module} />
      <EmbedBodyColorInput embedIndex={embedIndex} module={module} />
      <EmbedBodyTimestampInput embedIndex={embedIndex} module={module} />
    </div>
  );
}
