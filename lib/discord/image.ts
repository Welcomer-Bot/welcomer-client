"use client";

import { BaseCardConfig, DefaultCard } from "@welcomer-bot/card-canvas";

import type { GuildObject } from "./guild-types";
import type { UserObject } from "./user";
import { parseText } from "./text";

export async function generateImage(
  canvas: HTMLCanvasElement,
  msg: BaseCardConfig,
  user: UserObject,
  guild: GuildObject,
): Promise<void> {
  const cardConfig: BaseCardConfig = {
    ...msg,
    avatarImgURL: user.avatarUrl,
    renderer: "browser",
  };

  const card = DefaultCard.fromJSON(cardConfig);
  await card.build({
    canvasElement: canvas,
    replacer: (text: string) => parseText(text, user, guild, true) || "",
  });
}
