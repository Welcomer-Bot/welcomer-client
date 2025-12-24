import { BaseCardConfig, DefaultCard } from "@welcomer-bot/card-canvas";
import { cache } from "react";
import { getGuildData, getUserData } from "../dal";
import { parseText } from "./text";
export const generateImage = cache(
  async (msg: BaseCardConfig, guildId: string) => {
    const user = await getUserData();
    const guild = await getGuildData(guildId);

    if (!user || !guild) {
      throw new Error("User or Guild not found");
    }
    console.log("Generating image with config:", msg);
    const card = DefaultCard.fromJSON({
      ...msg,
      avatarImgURL: user?.avatarUrl,
      renderer: "browser",
    });
    const res = await card.build({
      replacer: (text: string) => parseText(text, user, guild) || "",
    });
    return res.toDataURL("image/png");
  },
);
