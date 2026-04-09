"use client";

import { SourceStoreContext } from "@/features/dashboard/modules/providers";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
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

  const hasImage = activeCardId !== null && activeCardId !== undefined;
  return (
    <Card shadow="sm">
      <CardHeader className="pb-0 flex justify-between items-center">
        <h3 className="font-semibold text-lg text-foreground">Image Card</h3>
        <Chip
          size="sm"
          variant="flat"
          color={
            hasImage
              ? imagePosition
                ? imagePosition === "outside"
                  ? "success"
                  : imageEmbedIndex !== undefined
                    ? "warning"
                    : "default"
                : "default"
              : "default"
          }
        >
          {hasImage
            ? imagePosition
              ? imagePosition === "outside"
                ? "Positioned"
                : imageEmbedIndex !== undefined
                  ? `Positioned`
                  : "Not positioned"
              : "Not positioned"
            : "Not created"}
        </Chip>
      </CardHeader>
      <CardBody className="space-y-4 pt-4">
        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="flat"
            color="primary"
            as={Link}
            href={`${pathname}/image`}
            startContent={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          >
            {hasImage ? "Edit Image" : "Create Image"}
          </Button>
          {imagePosition && (
            <Button
              variant="flat"
              color="danger"
              onPress={() => {
                setImagePosition(undefined, undefined);
              }}
              startContent={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              }
            >
              Remove from message
            </Button>
          )}
        </div>

        {/* Position selector */}
        <Select
          label="Image Position"
          placeholder="Select where to display the image"
          variant="bordered"
          selectedKeys={imagePosition ? [imagePosition] : []}
          disabledKeys={hasImage ? [] : ["outside", "embed"]}
          isDisabled={!hasImage}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as "outside" | "embed";
            setImagePosition(
              value,
              value === "embed" ? imageEmbedIndex : undefined,
            );
          }}
          description={
            !hasImage
              ? "Create an image card first to enable positioning"
              : undefined
          }
        >
          {positionOptions.map((option) => (
            <SelectItem key={option.value}>{option.label}</SelectItem>
          ))}
        </Select>

        {/* Embed selector when position is embed */}
        {imagePosition === "embed" && embedOptions.length > 0 && (
          <Select
            label="Target Embed"
            placeholder="Select which embed to attach the image to"
            variant="bordered"
            selectedKeys={
              imageEmbedIndex !== undefined ? [imageEmbedIndex.toString()] : []
            }
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0];
              if (value) {
                setImagePosition("embed", parseInt(value.toString()));
              }
            }}
          >
            {embedOptions.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </Select>
        )}

        {/* Warning when no embeds */}
        {imagePosition === "embed" && embedOptions.length === 0 && (
          <div className="p-3 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-warning"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-sm text-warning-700 dark:text-warning-300">
                No embeds available. Create an embed first to attach the image.
              </p>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
