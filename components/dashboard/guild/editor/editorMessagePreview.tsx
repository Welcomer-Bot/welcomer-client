"use client";

import { GuildObject } from "@/lib/discord/guild";
import { UserObject } from "@/lib/discord/user";
import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { lazy, Suspense, useContext } from "react";
import { useStore } from "zustand";

const LazyMessagePreview = lazy(() => import("./messagePreview"));

export default function EditorMessagePreview({
  guild,
  user,
}: {
  guild: GuildObject;
  user: UserObject;
}) {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const msg = useStore(store, (state) => state);

  if (!msg) return null;
  return (
    <div className="overflow-x-scroll h-full">
      <Suspense fallback={<div>Loading...</div>}>
        <LazyMessagePreview msg={msg} guild={guild} user={user} />
      </Suspense>
    </div>
  );
}
