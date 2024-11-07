import * as z from "zod"
import { CompleteEmbed, RelatedEmbedModel } from "./index"

export const EmbedFieldModel = z.object({
  id: z.number().int(),
  embedId: z.number().int(),
  name: z.string(),
  value: z.string(),
  inline: z.boolean().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteEmbedField extends z.infer<typeof EmbedFieldModel> {
  embed: CompleteEmbed
}

/**
 * RelatedEmbedFieldModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedEmbedFieldModel: z.ZodSchema<CompleteEmbedField> = z.lazy(() => EmbedFieldModel.extend({
  embed: RelatedEmbedModel,
}))
