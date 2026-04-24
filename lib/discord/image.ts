"use client";

import { BaseCardConfig, DefaultCard } from "@welcomer-bot/card-canvas";

import type { GuildObject } from "./guild-types";
import type { UserObject } from "./user";
import { parseText } from "./text";

export async function generateImage(
  msg: BaseCardConfig,
  user: UserObject,
  guild: GuildObject,
): Promise<void> {
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
}
