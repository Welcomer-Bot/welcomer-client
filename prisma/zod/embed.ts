import * as z from "zod"
import { CompleteEmbedFooter, RelatedEmbedFooterModel, CompleteEmbedField, RelatedEmbedFieldModel, CompleteEmbedAuthor, RelatedEmbedAuthorModel, CompleteEmbedImage, RelatedEmbedImageModel, CompleteWelcomer, RelatedWelcomerModel, CompleteLeaver, RelatedLeaverModel, CompleteDM, RelatedDMModel } from "./index"

export const EmbedModel = z.object({
  id: z.number().int().optional(),
  title: z.string().nullish(),
  description: z.string().nullish(),
  color: z.string().optional().nullish(),
  timestamp: z.date().optional().nullish(),
  timestampNow: z.boolean().optional().nullish(),
  thumbnail: z.string().optional().nullish(),
  url: z.string().optional().nullish(),
  created: z.date().optional(),
  updated: z.date().optional(),
  welcomerId: z.number().int().nullish(),
  leaverId: z.number().int().nullish(),
  DMId: z.number().int().nullish(),
})

export interface CompleteEmbed extends z.infer<typeof EmbedModel> {
  footer?: CompleteEmbedFooter | null
  fields: CompleteEmbedField[]
  author?: CompleteEmbedAuthor | null
  image?: CompleteEmbedImage | null
  welcomer?: CompleteWelcomer | null
  leaver?: CompleteLeaver | null
  DM?: CompleteDM | null
}

/**
 * RelatedEmbedModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedEmbedModel: z.ZodSchema<CompleteEmbed> = z.lazy(() => EmbedModel.extend({
  footer: RelatedEmbedFooterModel.nullish(),
  fields: RelatedEmbedFieldModel.array(),
  author: RelatedEmbedAuthorModel.nullish(),
  image: RelatedEmbedImageModel.nullish(),
  welcomer: RelatedWelcomerModel.optional().nullish(),
  leaver: RelatedLeaverModel.optional().nullish(),
  DM: RelatedDMModel.optional().nullish(),
}))
