import * as z from "zod"
import * as imports from "../null"
import { CompleteEmbed, RelatedEmbedModel } from "./index"

export const EmbedThumbnailModel = z.object({
  id: z.number().int(),
  embedId: z.number().int(),
  url: z.string(),
  width: z.number().int().nullish(),
  heigth: z.number().int().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteEmbedThumbnail extends z.infer<typeof EmbedThumbnailModel> {
  embed: CompleteEmbed
}

/**
 * RelatedEmbedThumbnailModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedEmbedThumbnailModel: z.ZodSchema<CompleteEmbedThumbnail> = z.lazy(() => EmbedThumbnailModel.extend({
  embed: RelatedEmbedModel,
}))
