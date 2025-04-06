"use server";

import { BaseCardParams, DefaultCard } from "@welcomer-bot/card-canvas";
import { parseText } from "./text";
import { getGuild, getUser } from "../dal";
import { cache } from "react";
export const generateImage = cache(async (msg: BaseCardParams, guildId: string) => {
  const user = await getUser();
  const guild = await getGuild(guildId);
  if (guild && user) {
    if (msg.mainText) {
      msg.mainText.content = parseText(msg.mainText.content ?? "", user, guild);
    }
    if (msg.nicknameText) {
      msg.nicknameText.content = parseText(
        msg.nicknameText.content ?? "",
        user,
        guild
      );
    }
    if (msg.secondText) {
      msg.secondText.content = parseText(
        msg.secondText.content ?? "",
        user,
        guild
      );
    }
  }
  const card = new DefaultCard({
    ...msg,
    avatarImgURL: user?.avatarUrl,
  });
  const res = await card.build();
  return res.toDataURL();
});
