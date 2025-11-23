"use client";

import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { useStore } from "zustand";

export default function ImagePositionEditor() {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");

  const pathname = usePathname();

  const imagePosition = useStore(store, (state) => state.imagePosition);
  const imageEmbedIndex = useStore(store, (state) => state.imageEmbedIndex);
  const embeds = useStore(store, (state) => state.message?.embeds || []);
  const setImagePosition = useStore(store, (state) => state.setImagePosition);
  const activeCardId = useStore(store, (state) => state.activeCardId);

  const positionOptions = [
    { value: "outside", label: "Outside of the embeds" },
    { value: "embed", label: "Inside of an embed" },
  ];

  const embedOptions = embeds.map((embed, index) => ({
    value: index.toString(),
    label: `Embed ${index + 1}: ${embed.title || "No title"}`,
  }));

  return (
    <Card>
      <CardHeader>Image position</CardHeader>
      <CardBody className="flex flex-row space-x-4">
        <Button
          variant="ghost"
          color="primary"
          as={Link}
          href={`${pathname}/image`}
        >
          Edit image
        </Button>
        <Button
          color="danger"
          isDisabled={!imagePosition}
          onPress={() => {
            setImagePosition(undefined, undefined);
          }}
        >
          Remove image
        </Button>
      </CardBody>
      <CardBody className="space-y-4">
        <Select
          label="Position"
          placeholder="Select image position"
          selectedKeys={imagePosition ? [imagePosition] : []}
          disabledKeys={["none"]}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as "outside" | "embed";
            setImagePosition(
              value,
              value === "embed" ? imageEmbedIndex : undefined,
            );
          }}
          classNames={{
            base: "max-w-full",
          }}
        >
          {activeCardId != undefined ? (
            positionOptions.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))
          ) : (
            <SelectItem key="none">Create an image first</SelectItem>
          )}
        </Select>

        {imagePosition === "embed" && embedOptions.length > 0 && (
          <Select
            label="Embed"
            placeholder="Select embed"
            selectedKeys={
              imageEmbedIndex !== undefined ? [imageEmbedIndex.toString()] : []
            }
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0];
              if (value) {
                setImagePosition("embed", parseInt(value.toString()));
              }
            }}
            classNames={{
              base: "max-w-full",
            }}
          >
            {embedOptions.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </Select>
        )}

        {imagePosition === "embed" && embedOptions.length === 0 && (
          <p className="text-warning text-sm">
            Warning: There are no embeds in the message to place the image.
            l&apos;image.
          </p>
        )}
      </CardBody>
    </Card>
  );
}
