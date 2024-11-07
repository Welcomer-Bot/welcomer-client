import * as z from "zod"
import { CompleteEmbed, RelatedEmbedModel } from "./index"

export const EmbedAuthorModel = z.object({
  id: z.number().int().optional(),
  embedId: z.number().int().optional(),
  name: z.string().nullish(),
  iconUrl: z.string().nullish(),
  url: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteEmbedAuthor extends z.infer<typeof EmbedAuthorModel> {
  embed: CompleteEmbed
}

/**
 * RelatedEmbedAuthorModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedEmbedAuthorModel: z.ZodSchema<CompleteEmbedAuthor> = z.lazy(() => EmbedAuthorModel.extend({
  embed: RelatedEmbedModel,
}))
