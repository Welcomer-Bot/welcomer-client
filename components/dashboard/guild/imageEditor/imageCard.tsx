"use client";

import { generateImage } from "@/lib/discord/image";
import { ImageStoreContext } from "@/providers/imageStoreProvider";
import { Card, CardFooter } from "@heroui/card";
import { Button } from "@heroui/react";
import { Skeleton } from "@heroui/skeleton";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useStore } from "zustand";

export function ImageCard({
  index,
  active = false,
  guildId,
}: {
  img?: string;
  index: number;
  active?: boolean;
  guildId: string;
}) {
  const store = useContext(ImageStoreContext);
  if (!store) throw new Error("Missing ImageStore.Provider in the tree");

  const currentCard = useStore(store, (state) => state.imageCards[index]);
  const setActiveCard = useStore(store, (state) => state.setActiveCard);
  const setPreviewImage = useStore(store, (state) => state.setPreviewImage);
  const deleteCard = useStore(store, (state) => state.deleteCard);
  const activeCard = useStore(store, (state) => state.selectedCard);
  const [image, setImage] = useState<string | null>(null);
  const previewImage = currentCard?.imagePreview;
  const [debounceImage, setDebounceImage] = useState(currentCard);

  useEffect(() => {
    if (!debounceImage) return setDebounceImage(currentCard);
    const timeout = setTimeout(() => {
      setDebounceImage(currentCard);
    }, 500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCard]);

  useEffect(() => {
    if (!debounceImage) return;
    if (!guildId) return;
    const loadPreview = async () => {
      const previewImage = await generateImage(debounceImage, guildId);
      if (!previewImage) return;
      // console.log("setting preview image");
      setImage(previewImage);
      setPreviewImage(previewImage);
    };
    loadPreview();
  }, [debounceImage, guildId, previewImage, setPreviewImage, activeCard]);
  return (
    <div
      onClick={() => {
        setActiveCard(index);
      }}
    >
      <Card className={active ? "border-2 border-primary" : ""}>
        {!image ? (
          <Skeleton>
            <div className="w-48 h-24 bg-dark-2 rounded-lg"></div>
          </Skeleton>
        ) : (
          <>
            <Button
              className="absolute top-2 right-2"
              isIconOnly
              color="danger"
              variant="ghost"
              onPress={() => {
                deleteCard(index);
              }}
            >
              <FaTrash />
            </Button>
            <Image
              src={image}
              alt={`Card ${index + 1}`}
              width={800}
              height={350}
            />
          </>
        )}
        <CardFooter>Card {index + 1}</CardFooter>
      </Card>
    </div>
  );
}
