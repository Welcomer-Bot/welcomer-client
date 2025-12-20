"use server";

import { BaseCardConfig, DefaultCard } from "@welcomer-bot/card-canvas";
import { cache } from "react";
import { getGuild, getUser } from "../dal";
import { parseText } from "./text";
export const generateImage = cache(
  async (msg: BaseCardConfig, guildId: string) => {
    const user = await getUser();
    const guild = await getGuild(guildId);
    if (guild && user) {
      if (msg.mainText) {
        msg.mainText.content = parseText(
          msg.mainText.content ?? null,
          user,
          guild,
        );
      } else {
        msg.mainText = null;
      }
      if (msg.nicknameText) {
        msg.nicknameText.content = parseText(
          msg.nicknameText.content ?? null,
          user,
          guild,
        );
      } else {
        msg.nicknameText = null;
      }
      if (msg.secondText) {
        msg.secondText.content = parseText(
          msg.secondText.content ?? null,
          user,
          guild,
        );
      } else {
        msg.secondText = null;
      }
    }
    console.log("Generating image with config:", msg);
    const card = DefaultCard.fromJSON({
      ...msg,
      avatarImgURL: user?.avatarUrl,
    });
    const res = await card.toDataURL();
    return res;
  },
);
