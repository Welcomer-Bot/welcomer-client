import { useEffect, useMemo, useState } from "react";

import { generateImage } from "@/lib/discord/image";

import { BaseCardConfig } from "../types";

export function useImageEditor(guildId: string, config: BaseCardConfig) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const configStr = useMemo(() => JSON.stringify(config), [config]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fetchCard = async () => {
        try {
          setIsLoading(true);
          setError(null);

          await generateImage(config, guildId);
          setIsLoading(false);
        } catch (error) {
          setError(
            error instanceof Error ? error.message : "Failed to generate image",
          );
          setIsLoading(false);
        }
      };

      fetchCard();
    }, 1000);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configStr, guildId]);

  return {
    error,
    isLoading,
  };
}
