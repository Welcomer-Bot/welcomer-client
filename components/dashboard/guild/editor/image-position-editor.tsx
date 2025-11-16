"use client";

import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Select, SelectItem } from "@heroui/select";
import { useContext } from "react";
import { useStore } from "zustand";

export default function ImagePositionEditor() {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");

  const imagePosition = useStore(
    store,
    (state) => state.imagePosition || "outside"
  );
  const imageEmbedIndex = useStore(store, (state) => state.imageEmbedIndex);
  const embeds = useStore(store, (state) => state.message?.embeds || []);
  const setImagePosition = useStore(store, (state) => state.setImagePosition);
  const activeCardId = useStore(store, (state) => state.activeCardId);

  // Ne rien afficher si pas de carte active
  if (!activeCardId) {
    return null;
  }

  const positionOptions = [
    { value: "outside", label: "À l'extérieur des embeds" },
    { value: "embed", label: "Dans un embed" },
  ];

  const embedOptions = embeds.map((embed, index) => ({
    value: index.toString(),
    label: `Embed ${index + 1}: ${embed.title || "Sans titre"}`,
  }));

  return (
    <Card>
      <CardHeader>Image position</CardHeader>
      <CardBody className="space-y-4">
        <Select
          label="Position"
          placeholder="Sélectionner une position"
          selectedKeys={[imagePosition]}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as "outside" | "embed";
            setImagePosition(
              value,
              value === "embed" ? imageEmbedIndex : undefined
            );
          }}
          classNames={{
            base: "max-w-full",
          }}
        >
          {positionOptions.map((option) => (
            <SelectItem key={option.value}>{option.label}</SelectItem>
          ))}
        </Select>

        {imagePosition === "embed" && embedOptions.length > 0 && (
          <Select
            label="Embed cible"
            placeholder="Sélectionner un embed"
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
            Aucun embed disponible. Créez un embed pour pouvoir y placer
            l&apos;image.
          </p>
        )}
      </CardBody>
    </Card>
  );
}
