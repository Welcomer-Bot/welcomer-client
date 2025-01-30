"use client";

import { generateImage } from "@/lib/discord/image";
import { useImageStore } from "@/state/image";
import { Button } from "@heroui/button";
import { Card, CardFooter } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

export function ImageCard({
  index,
  active = false,
}: {
  img?: string;
  index: number;
  active?: boolean;
}) {
  const [image, setImage] = useState<string | null>(null);
  const currentCard = useImageStore((state) => state.imageCards[index]);
  const previewImage = currentCard?.imagePreview;
  const setActiveCard = useImageStore((state) => state.setActiveCard);
  const setPreviewImage = useImageStore((state) => state.setPreviewImage);
  const deleteCard = useImageStore((state) => state.deleteCard);
  useEffect(() => {
    if (previewImage) {
      setImage(previewImage);
    } else {
      if (!currentCard) return;
      const loadPreview = async () => {
        const previewImage = await generateImage(currentCard);
        if (!previewImage) return;
        setImage(previewImage);
        setPreviewImage(previewImage);
      };
      loadPreview();
    }
  }, [previewImage]);
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
            <div className="*:hover:flex">
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
              <img src={image} alt={`Card ${index + 1}`} />
            </div>
          </>
        )}
        <CardFooter>Card {index + 1}</CardFooter>
      </Card>
    </div>
  );
}
