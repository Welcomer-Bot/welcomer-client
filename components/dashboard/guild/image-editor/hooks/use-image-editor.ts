import { useEffect, useMemo, useState } from "react";

import { getImageRenderContext } from "@/features/dashboard/modules/actions";
import { generateImage } from "@/lib/discord/image";

import { BaseCardConfig } from "../types";

export function useImageEditor(
  canvas: HTMLCanvasElement | null,
  guildId: string,
  config: BaseCardConfig | null,
) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const configStr = useMemo(() => JSON.stringify(config), [config]);

  useEffect(() => {
    if (!canvas || !config) return;

    const timeoutId = setTimeout(() => {
      const fetchCard = async () => {
        try {
          setIsLoading(true);
          setError(null);

          const { user, guild } = await getImageRenderContext(guildId);
          if (!user || !guild) {
            throw new Error("User or Guild data not found");
          }
          await generateImage(canvas, config, user, guild);
          setIsLoading(false);
        } catch (error) {
          setError(
            error instanceof Error ? error.message : "Failed to generate image",
          );
          setIsLoading(false);
        }
      };

      fetchCard();
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, configStr, guildId]);

  return {
    error,
    isLoading,
  };
}
