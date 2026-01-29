"use client";

import { ImageTextType } from "@/types";
import { Switch } from "@heroui/switch";

import { ImageStoreContext } from "@/providers/imageStoreProvider";
import { useContext } from "react";
import { useStore } from "zustand";

const textTypesToText = {
  mainText: "Main Text",
  secondText: "Second Text",
  nicknameText: "Nickname Text",
};

export function ImageTextSwitch({
  textType,
  children,
}: {
  textType: ImageTextType;
  children: React.ReactNode;
}) {
  const store = useContext(ImageStoreContext);
  if (!store) throw new Error("Missing ImageStore.Provider in the tree");

  const enabled = useStore(store, (state) => state.getActiveCard()![textType]);
  const removeText = useStore(store, (state) => state.removeText);
  const addText = useStore(store, (state) => state.addText);

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
      >
        Enable {textTypesToText[textType]}
      </Switch>
      {enabled && children}
    </>
  );
}
