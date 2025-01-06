"use client";

import { Leaver, Welcomer } from "@/lib/discord/schema";
import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";
import debounce from "debounce";
import { lazy, Suspense, useState } from "react";

const LazyMessagePreview = lazy(() => import("./messagePreview"));

export default function EditorMessagePreview() {
  const [msg, setMsg] = useState<Welcomer | Leaver>();
  const debouncedSetMessage = debounce(setMsg, 250);
  const moduleName = useModuleNameStore((state) => state.moduleName);
  const store = moduleName === "welcomer" ? useWelcomerStore : useLeaverStore;

  const state = store();
  debouncedSetMessage(state);

  if (!msg) return null;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyMessagePreview msg={msg} />
    </Suspense>
  );
}
