"use client";

import {BaseCardConfig, DefaultCard} from "@welcomer-bot/card-canvas";
import {cache} from "react";
import {getGuildData, getUserData} from "../dal";
import {parseText} from "./text";

export const generateImage = cache(
  async (
    msg: BaseCardConfig,
    guildId: string,
  ): Promise<void> => {
    console.log("Generating image with config:", msg);
    const user = await getUserData();
    const guild = await getGuildData(guildId);
    if (!user || !guild) {
      throw new Error("User or Guild data not found");
    }

    const canvas = document.getElementById(
      "preview-canvas",
    ) as HTMLCanvasElement | null;

    const cardConfig: BaseCardConfig = {
      ...msg,
      avatarImgURL: user.avatarUrl,
      renderer: "browser",
    };

    const card = DefaultCard.fromJSON(cardConfig);
    await card.build({
      canvasElement: canvas || undefined,
      replacer: (text: string) => parseText(text, user, guild, true) || "",
    });

  },
);
