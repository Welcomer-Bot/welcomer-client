import * as z from "zod"
import { CompleteEmbed, RelatedEmbedModel } from "./index"

export const EmbedFooterModel = z.object({
  id: z.number().int(),
  embedId: z.number().int(),
  text: z.string(),
  iconUrl: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteEmbedFooter extends z.infer<typeof EmbedFooterModel> {
  embed: CompleteEmbed
}

/**
 * RelatedEmbedFooterModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedEmbedFooterModel: z.ZodSchema<CompleteEmbedFooter> = z.lazy(() => EmbedFooterModel.extend({
  embed: RelatedEmbedModel,
}))
