import {
  EmbedModel,
  RelatedEmbedModel,
  RelatedImageCardModel,
  RelatedImageCardTextModel,
  RelatedLeaverModel,
  RelatedWelcomerModel,
} from "@/prisma/schema";
import {
  BaseCardParams as BCP,
  TextCard as TC,
} from "@welcomer-bot/card-canvas";
import * as z from "zod";

export type Welcomer = z.infer<typeof RelatedWelcomerModel>;
export type Leaver = z.infer<typeof RelatedLeaverModel>;
export type FullEmbed = z.infer<typeof RelatedEmbedModel>;
export type Embed = z.infer<typeof EmbedModel>;
export type ImageCard = z.infer<typeof RelatedImageCardModel>;
export type ImageCardText = z.infer<typeof RelatedImageCardTextModel>;
export type BaseCardParams = BCP & {
  id?: number;
  mainText?: TextCard | null;
  secondText?: TextCard | null;
  nicknameText?: TextCard | null;
};
export type TextCard = TC & { id?: number };
