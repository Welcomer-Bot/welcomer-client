import { Suspense } from "react";

import { GuildObject } from "@/lib/discord/guild";
import { GuildCardSkeleton } from "../../guildCard";
import { GuildSelectDropdownClient } from "./guildSelectDropdownClient";

interface GuildSelectDropdownServerProps {
  guilds: GuildObject[];
  currentGuild: GuildObject;
}

export function GuildSelectDropdownServer({
  guilds,
  currentGuild,
}: GuildSelectDropdownServerProps) {
  return (
    <div className="hidden sm:grid">
      <Suspense fallback={<GuildDropdownSkeleton />}>
        <GuildSelectDropdownClient
          currentGuild={currentGuild}
          guilds={guilds}
        />
      </Suspense>
    </div>
  );
}

function GuildDropdownSkeleton() {
  return (
    <>
      <div className="m-2">
        <GuildCardSkeleton />
      </div>
    </>
  );
}
