"use client";

import { fetchFontList } from "@/lib/dto";
import { ImageStoreContext } from "@/providers/imageStoreProvider";
import { ImageTextType } from "@/types";
import { Select, SelectItem } from "@heroui/select";
import { useContext, useEffect, useState } from "react";
import { useStore } from "zustand";

export function ImageFontInput({ textType }: { textType: ImageTextType }) {
  const store = useContext(ImageStoreContext);
  if (!store) throw new Error("Missing ImageStore.Provider in the tree");

  const font = useStore(
    store,
    (state) => state.getActiveCard()![textType]?.font
  );
  const setFont = useStore(store, (state) => state.setTextFont);

  const [fontsList, setFontsList] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const updateStats = async () => {
      setIsLoading(true);
      const updatedChannels = await fetchFontList();
      setFontsList(updatedChannels);
      setIsLoading(false);
    };
    updateStats();
  }, []);

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFont(textType, e.target.value);
  };
  return (
    <Select
      label="Font"
      value={font ?? ""}
      isLoading={isLoading}
      isVirtualized
      onChange={handleSelectionChange}
      selectedKeys={font && fontsList ? [font] : []}
    >
      {fontsList
        ? fontsList.map((font) => {
            return (
              <SelectItem key={font} textValue={font}>
                <div style={{ fontFamily: font }}>{font}</div>
              </SelectItem>
            );
          })
        : null}
    </Select>
  );
}
