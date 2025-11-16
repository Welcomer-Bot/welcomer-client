"use client";

import { GuildObject } from "@/lib/discord/guild";
import { generateImage } from "@/lib/discord/image";
import { parseMessageToReactElement } from "@/lib/discord/text";
import { UserObject } from "@/lib/discord/user";
import { SourceState } from "@/state/source";
import { BaseCardConfig } from "@welcomer-bot/card-canvas";
import { JSX, useEffect, useState } from "react";

export default function MessagePreview({
  msg,
  guild,
  user,
}: {
  msg: SourceState;
  guild: GuildObject;
  user: UserObject;
}) {
  const [image, setImage] = useState<string | undefined>(undefined);
  const [text, setText] = useState<JSX.Element>();

  // Charger l'image si une carte active existe
  useEffect(() => {
    const loadImage = async () => {
      if (!msg.activeCard || !msg.guildId) {
        setImage(undefined);
        return;
      }

      try {
        const generatedImage = await generateImage(
          msg.activeCard.data as BaseCardConfig,
          msg.guildId
        );
        setImage(generatedImage);
      } catch (error) {
        console.error("Error loading image:", error);
        setImage(undefined);
      } finally {
      }
    };

    loadImage();
  }, [msg.activeCard, msg.guildId]);

  useEffect(() => {
    if (!user || !guild) return;
    setText(
      parseMessageToReactElement(msg.message, user, guild, {
        image: image,
        imagePosition: msg.imagePosition || "outside",
        imageEmbedIndex: msg.imageEmbedIndex,
      })
    );
  }, [msg, user, guild, image]);

  return <div className="rounded-lg min-h-full w-full min-w-fit">{text}</div>;
}
