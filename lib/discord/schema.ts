import {
  EmbedModel,
  RelatedEmbedModel,
  RelatedImageCardModel,
  RelatedImageCardTextModel,
} from "@/prisma/schema";
import {
  BaseCardParams as BCP,
  TextCard as TC,
} from "@welcomer-bot/card-canvas";
import * as z from "zod";

export type FullEmbed = z.infer<typeof RelatedEmbedModel>;
export type Embed = z.infer<typeof EmbedModel>;
export type ImageCard = z.infer<typeof RelatedImageCardModel>;
export type ImageCardText = z.infer<typeof RelatedImageCardTextModel>;
export type BaseCardParams = Omit<
  BCP,
  "mainText" | "secondText" | "nicknameText"
> & {
  id?: number;
  mainText?: TextCard | null;
  secondText?: TextCard | null;
  nicknameText?: TextCard | null;
};
export type TextCard = TC & { id?: number };
