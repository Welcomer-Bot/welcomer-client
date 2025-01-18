"use client";

import { useImageStore } from "@/state/image";
import { ImageTextType } from "@/types";
import { Switch } from "@nextui-org/switch";

const textTypesToText = {
  mainText: "Main Text",
  secondText: "Second Text",
  nicknameText: "Nickname Text",
};

export function ImageTextSwitch({ textType, children }: { textType: ImageTextType, children: React.ReactNode }) {
    const enabled = useImageStore((state) => state.getActiveCard()![textType]);
    const removeText = useImageStore((state) => state.removeText);
    const addText = useImageStore((state) => state.addText);

    return (
        
        <>
        <Switch
        isSelected={!!enabled}
        onChange={() => {
            if (enabled) {
                removeText(textType);
            } else {
                addText(textType);
            }
        }}
        >Enable {textTypesToText[textType]}
    </Switch>
    {enabled && children}
    </>
    );
}   
