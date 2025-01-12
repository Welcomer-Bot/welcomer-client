import {
  EmbedModel,
  RelatedEmbedModel,
  RelatedImageCardModel,
  RelatedImageCardTextModel,
  RelatedLeaverModel,
  RelatedWelcomerModel,
} from "@/prisma/schema";
import * as z from "zod";

export type Welcomer = z.infer<typeof RelatedWelcomerModel>;
export type Leaver = z.infer<typeof RelatedLeaverModel>;
export type FullEmbed = z.infer<typeof RelatedEmbedModel>;
export type Embed = z.infer<typeof EmbedModel>;
export type ImageCard = z.infer<typeof RelatedImageCardModel>;
export type ImageCardText = z.infer<typeof RelatedImageCardTextModel>;
