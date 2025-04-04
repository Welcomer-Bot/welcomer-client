"use client";

import { LeaverStore, useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore, WelcomerStore } from "@/state/welcomer";
import debounce from "debounce";
import { lazy, Suspense, useEffect, useState } from "react";

const LazyMessagePreview = lazy(() => import("./messagePreview"));

export default function EditorMessagePreview() {
  const [msg, setMsg] = useState<WelcomerStore | LeaverStore>();
  const debouncedSetMessage = debounce(setMsg, 250);
  const moduleName = useModuleNameStore((state) => state.moduleName);
  const store = moduleName === "welcomer" ? useWelcomerStore : useLeaverStore;

  const state = store();
  useEffect(() => {
    debouncedSetMessage(state);
  }, [state, debouncedSetMessage]);

  if (!msg) return null;
  return (
    <div className="overflow-x-scroll">
      <Suspense fallback={<div>Loading...</div>}>
        <LazyMessagePreview msg={msg.toObject()} />
      </Suspense>
    </div>
  );
}
