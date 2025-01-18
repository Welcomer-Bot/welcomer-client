"use client";

import { getServerFonts } from "@/lib/actions";
import { useImageStore } from "@/state/image";
import { ImageTextType } from "@/types";
import { Select, SelectItem } from "@nextui-org/select";
import { FontList } from "font-list";
import { useEffect, useState } from "react";

export function ImageFontInput({
  textType,
}: {
    textType: ImageTextType;
}) {
  const font = useImageStore((state) => state.getActiveCard()![textType]?.font);
  const setFont = useImageStore((state) => state.setTextFont);

  const [fontsList, setFontsList] = useState<FontList | null>(null);
  useEffect(() => {
    getServerFonts().then((fonts) => {
      setFontsList(fonts);
    });
  }, []);

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFont(textType, e.target.value);
  };
  return (
    <Select
      label="Font"
      value={font ?? ""}
      isVirtualized
      onChange={handleSelectionChange}
      selectedKeys={font ? [font] : []}
    >
      {fontsList
        ? fontsList.map((font) => {
            return (
              <SelectItem key={font} value={font} textValue={font}>
                <div style={{ fontFamily: font }}>{font}</div>
              </SelectItem>
            );
          })
        : null}
    </Select>
  );
}
