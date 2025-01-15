"use client";

import { getServerFonts } from "@/lib/actions";
import { useImageStore } from "@/state/image";
import { Select, SelectItem } from "@nextui-org/select";
import { FontList } from "font-list";
import { useEffect, useState } from "react";

export function ImageFontInput({
  textType,
}: {
  textType: "mainText" | "secondText";
}) {
  const font = useImageStore((state) => state.getActiveCard()![textType]?.font);
  const setFont =
    textType === "mainText"
      ? useImageStore((state) => state.setMainTextFont)
      : useImageStore((state) => state.setSecondTextFont);

  const [fontsList, setFontsList] = useState<FontList | null>(null);
  useEffect(() => {
    getServerFonts().then((fonts) => {
      setFontsList(fonts);
    });
  }, []);

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFont(e.target.value);
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
