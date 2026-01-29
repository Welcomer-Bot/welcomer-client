"use client";

import { ImageStoreContext } from "@/providers/imageStoreProvider";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { useContext, useEffect, useState } from "react";
import { useStore } from "zustand";

export function ImageBackgroundUrlInput() {
  const store = useContext(ImageStoreContext);
  if (!store) throw new Error("Missing ImageStore.Provider in the tree");

  const backgroundUrl = useStore(
    store,
    (state) => state.getActiveCard()!.backgroundImgURL
  );
  const setBackgroundUrl = useStore(store, (state) => state.setBackgroundUrl);

  const [enabled, setEnabled] = useState<boolean>(
    typeof backgroundUrl === "string"
  );

  useEffect(() => {
    if (enabled && backgroundUrl !== null) return;
    if(!enabled && backgroundUrl === null) return;
    if (!enabled) {
      setBackgroundUrl(null);
    } else {
      setBackgroundUrl(backgroundUrl ?? " ");
    }
  }, [enabled, setBackgroundUrl, backgroundUrl]);

  useEffect(() => {
    if (backgroundUrl === null) {
      setEnabled(false);
    } else {
      setEnabled(true);
    }
  }, [backgroundUrl]);
  return (
    <>
      <Switch isSelected={enabled} onValueChange={setEnabled}>
        Enable background image
      </Switch>
      {enabled && (
        <Input
          type="url"
          label="Background URL"
          aria-label="Background URL"
          value={backgroundUrl ?? ""}
          onValueChange={(value) => setBackgroundUrl(value)}
          isClearable
        />
      )}
    </>
  );
}
