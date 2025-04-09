"use client";

import { GuildObject } from "@/lib/discord/guild";
import { UserObject } from "@/lib/discord/user";
import { LeaverStore, useLeaverStore } from "@/state/leaver";
import { useWelcomerStore, WelcomerStore } from "@/state/welcomer";
import { ModuleName } from "@/types";
import debounce from "debounce";
import { lazy, Suspense, useEffect, useState } from "react";

const LazyMessagePreview = lazy(() => import("./messagePreview"));

export default function EditorMessagePreview({module, guild, user}: {module: ModuleName, guild: GuildObject, user: UserObject}) {
  const [msg, setMsg] = useState<WelcomerStore | LeaverStore>();
  const debouncedSetMessage = debounce(setMsg, 250);
  const store = module === "welcomer" ? useWelcomerStore : useLeaverStore;

  const state = store();
  useEffect(() => {
    debouncedSetMessage(state);
  }, [state, debouncedSetMessage]);

  if (!msg) return null;
  return (
    <div className="overflow-x-scroll">
      <Suspense fallback={<div>Loading...</div>}>
        <LazyMessagePreview msg={msg.toObject()} guild={guild} user={user} />
      </Suspense>
    </div>
  );
}
