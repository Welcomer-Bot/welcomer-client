"use client";

import { fetchFontList } from "@/lib/dto";
import { useImageStore } from "@/state/image";
import { ImageTextType } from "@/types";
import { Select, SelectItem } from "@heroui/select";
import { FontList } from "font-list";
import { useEffect, useState } from "react";

export function ImageFontInput({ textType }: { textType: ImageTextType }) {
  const font = useImageStore((state) => state.getActiveCard()![textType]?.font);
  const setFont = useImageStore((state) => state.setTextFont);

  const [fontsList, setFontsList] = useState<FontList | null>(null);
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
