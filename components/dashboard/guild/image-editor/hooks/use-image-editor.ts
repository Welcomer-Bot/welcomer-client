import { generateImage } from "@/lib/discord/image";
import { useEffect, useMemo, useState } from "react";
import { BaseCardConfig } from "../types";

export function useImageEditor(guildId: string, config: BaseCardConfig) {
  const [card, setCard] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sérialiser la config pour éviter les re-renders inutiles
  const configStr = useMemo(() => JSON.stringify(config), [config]);

  useEffect(() => {
    // Debounce de 1 seconde avant de générer l'image
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
            error instanceof Error ? error.message : "Failed to generate image",
          );
          setCard(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCard();
    }, 1000);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configStr, guildId]);

  return {
    card,
    error,
    isLoading,
  };
}
