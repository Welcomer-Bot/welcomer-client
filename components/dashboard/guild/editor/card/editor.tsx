"use client";
import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";
import { Button, Radio, RadioGroup } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";

export function CardPositionEditor() {
  const router = useRouter();
  const path = usePathname();
  const module = useModuleNameStore((state) => state.moduleName);
  const store = module === "welcomer" ? useWelcomerStore() : useLeaverStore();
  const activeCardId = store.activeCardId;
  const embeds = store.embeds;
  return activeCardId === null ? (
    <div className="text-center w-full">
      <p>You dont have active card to show, select active card first</p>
      <Button
        className="mt-4"
        color="primary"
        onPress={() => router.push(path + "/image")}
      >
        Select Active Card
      </Button>
    </div>
  ) : (
    <div>
      <Button color="primary" onPress={() => router.push(path + "/image")}>
        Select Active Card
      </Button>
      <RadioGroup
        label="Card Position"
        value={
          store.activeCardToEmbedId?.toString() ||
          (store.activeCardToEmbedId == null && store.activeCard ? "-1" : null)
        }
        onValueChange={(value) => {
          store.setActiveCardEmbedPosition(Number(value));
        }}
      >
        {embeds.map((embed, index) => (
          <Radio key={index} value={index.toString()}>
            {`Embed ${index + 1}`}
          </Radio>
        ))}
        <Radio value={"-1"}>On the message bottom</Radio>
        <Radio value={"-2"}>Do not show card</Radio>
      </RadioGroup>
    </div>
  );
}
