import { generateImage } from "@/lib/discord/image";
import { useEffect, useState } from "react";
import { BaseCardConfig } from "../types";

export function useImageEditor(guildId: string, config: BaseCardConfig) {
  const [card, setCard] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Debounce de 2.5 secondes avant de générer l'image
    const timeoutId = setTimeout(() => {
      const fetchCard = async () => {
        try {
          setIsLoading(true);
          setError(null);

          const result = await generateImage(config, guildId);
          setCard(result);
        } catch (error) {
          console.error("Error generating image:", error);
          setError(
            error instanceof Error ? error.message : "Failed to generate image"
          );
          setCard(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCard();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [config, guildId]);

  return {
    card,
    error,
    isLoading,
  };
}
