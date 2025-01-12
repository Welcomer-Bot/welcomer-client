"use server";

import { ImageCard } from "@/lib/discord/schema";
import { Color, DefaultWelcomeCard } from "@welcomer-bot/card-canvas";
export async function generateImage(msg: ImageCard) {
  const card = new DefaultWelcomeCard({
    mainText: msg.mainText
      ? {
          content: msg.mainText.content,
          color: (msg.mainText.color as Color) || undefined,
          font: msg.mainText.font || undefined,
        }
      : undefined,
    secondText: msg.secondText
      ? {
          content: msg.secondText.content,
          color: (msg.secondText.color as Color) || undefined,
          font: msg.secondText.font || undefined,
        }
      : undefined,
    backgroundColor: {
      background: msg.backgroundColor
        ? (msg.backgroundColor as Color)
        : "#000000",
    },
    backgroundImgURL: msg.backgroundUrl || undefined,
  });
  return (await card.build()).toDataURL();
}
