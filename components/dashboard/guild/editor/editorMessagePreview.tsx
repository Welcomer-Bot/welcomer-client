"use client";

import { Welcomer } from "@/lib/discord/schema";
import { useWelcomerStore } from "@/state/welcomer";
import debounce from "debounce";
import { lazy, Suspense, useState } from "react";

const LazyMessagePreview = lazy(() => import("./messagePreview"));

export default function EditorMessagePreview() {
  const [msg, setMsg] = useState<Welcomer>();

  const debouncedSetMessage = debounce(setMsg, 250);

    useWelcomerStore((state) => debouncedSetMessage(state));
    
    if (!msg) return null;
    return (
        <Suspense>
            <LazyMessagePreview msg={msg} />
        </Suspense>
    )
}
