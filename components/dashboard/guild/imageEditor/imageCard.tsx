"use client";

import { generateImage } from "@/lib/discord/image";
import { useImageStore } from "@/state/image";
import { Button } from "@heroui/button";
import { Card, CardFooter } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

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
  const [image, setImage] = useState<string | null>(null);
  const currentCard = useImageStore((state) => state.imageCards[index]);
  const previewImage = currentCard?.imagePreview;
  const setActiveCard = useImageStore((state) => state.setActiveCard);
  const setPreviewImage = useImageStore((state) => state.setPreviewImage);
  const deleteCard = useImageStore((state) => state.deleteCard);
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
      setImage(previewImage);
      setPreviewImage(previewImage);
    };
    loadPreview();
  }, [debounceImage, guildId, previewImage, setPreviewImage]);
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
              className="absolute top-2 right-2 hidden"
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
