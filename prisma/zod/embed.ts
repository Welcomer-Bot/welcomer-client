import * as z from "zod"
import * as imports from "../null"
import { CompleteEmbedFooter, RelatedEmbedFooterModel, CompleteEmbedField, RelatedEmbedFieldModel, CompleteEmbedAuthor, RelatedEmbedAuthorModel, CompleteEmbedImage, RelatedEmbedImageModel, CompleteEmbedThumbnail, RelatedEmbedThumbnailModel, CompleteWelcomer, RelatedWelcomerModel, CompleteLeaver, RelatedLeaverModel, CompleteDM, RelatedDMModel } from "./index"

export const EmbedModel = z.object({
  id: z.number().int().nullish(),
  title: z.string().nullish(),
  description: z.string().nullish(),
  color: z.number().int().nullish(),
  timestamp: z.date().nullish(),
  created: z.date().nullish(),
  updated: z.date().nullish(),
  welcomerId: z.number().int().nullish(),
  leaverId: z.number().int().nullish(),
  DMId: z.number().int().nullish(),
})

export interface CompleteEmbed extends z.infer<typeof EmbedModel> {
  footer?: CompleteEmbedFooter | null
  fields: CompleteEmbedField[]
  author?: CompleteEmbedAuthor | null
  image?: CompleteEmbedImage | null
  thumbnail?: CompleteEmbedThumbnail | null
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
  footer: RelatedEmbedFooterModel.nullish().nullish(),
  fields: RelatedEmbedFieldModel.array().nullish(),
  author: RelatedEmbedAuthorModel.nullish().nullish(),
  image: RelatedEmbedImageModel.nullish().nullish(),
  thumbnail: RelatedEmbedThumbnailModel.nullish().nullish(),
  welcomer: RelatedWelcomerModel.nullish().nullish(),
  leaver: RelatedLeaverModel.nullish().nullish(),
  DM: RelatedDMModel.nullish().nullish(),
}))
