import { EmbedModel, RelatedEmbedModel, RelatedWelcomerModel } from "@/prisma/schema";
import * as z from "zod";

export type Welcomer = z.infer<typeof RelatedWelcomerModel>;
export type FullEmbed = z.infer<typeof RelatedEmbedModel>;
export type Embed = z.infer<typeof EmbedModel>;