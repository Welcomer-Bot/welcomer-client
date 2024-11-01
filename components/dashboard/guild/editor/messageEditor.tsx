import { Leaver, Welcomer } from "@prisma/client";

import SendMenu from "./sendMenu";
import ContentEditor from "./contentEditor";
import EmbedMenuAccordion from "./embed/embedMenuAccordion";

import { getGuildChannels } from "@/lib/dal";

export async function MessageEditor({ module }: { module: Welcomer | Leaver }) {
  const channels = await getGuildChannels(module.guildId);

  return (
    <div className="lg:w-1/2 container px-4">
      <div className="flex flex-col space-y-4">
        <SendMenu channels={channels!} />
        <ContentEditor content={module.content ?? undefined} />
        <EmbedMenuAccordion module={module} />
      </div>
    </div>
  );
}
