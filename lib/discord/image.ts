import { BaseCardParams, DefaultCard } from "@welcomer-bot/card-canvas";
export async function generateImage(msg: BaseCardParams) {
  if (msg.backgroundImgURL) { 
    msg = {
      ...msg,
      backgroundImgURL: (await fetch("/api/loadimage?url=" + encodeURIComponent(msg.backgroundImgURL))).url
    }
  }
  const card = new DefaultCard(msg);
  const res = await card
    .build()
  return res.toDataURL();
}
