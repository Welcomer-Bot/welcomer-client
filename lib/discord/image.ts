"use client";

import { BaseCardParams, DefaultCard } from "@welcomer-bot/card-canvas";
export async function generateImage(msg: BaseCardParams) {
  const card = new DefaultCard(msg);
  const res = await card
    .build()
  return res.toDataURL();
}
