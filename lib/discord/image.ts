"use server";

import { BaseCardParams, DefaultCard } from "@welcomer-bot/card-canvas";
export async function generateImage(msg: BaseCardParams) {
  const card = new DefaultCard(msg);
  const res = card
    .build()
    .then((build) => {
      return build.toDataURL();
    })
    .catch((err) => {
      throw err;
    });
  return res;
}
