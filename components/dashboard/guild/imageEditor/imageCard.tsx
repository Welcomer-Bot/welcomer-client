"use client";

import { generateImage } from "@/lib/discord/image";
import { useImageStore } from "@/state/image";
import { Card, CardFooter } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import { useEffect, useState } from "react";

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
  useEffect(() => {
    if (previewImage) {
      setImage(previewImage);
    } else {
      if (!currentCard) return;
      const loadPreview = async () => {
        const generatedImage = await generateImage(currentCard);
        setImage(generatedImage);
        setPreviewImage(generatedImage)
      };
      loadPreview();
    }
  }, [previewImage]);
  return (
    <div
      onClick={() => {
        setActiveCard(index);
        console.log("Card clicked");
      }}
    >
      <Card className={active ? "border-2 border-primary" : ""}>
        {!image ? (
          <Skeleton>
            <div className="w-48 h-20 bg-dark-2 rounded-lg"></div>
          </Skeleton>
        ) : (
          <img src={image} alt={"card " + index} />
        )}
        <CardFooter>Card {index + 1}</CardFooter>
      </Card>
    </div>
  );
}
