import * as z from "zod"
import * as imports from "../null"
import { CompleteEmbedFooter, RelatedEmbedFooterModel, CompleteEmbedField, RelatedEmbedFieldModel, CompleteEmbedAuthor, RelatedEmbedAuthorModel, CompleteEmbedImage, RelatedEmbedImageModel, CompleteEmbedThumbnail, RelatedEmbedThumbnailModel, CompleteWelcomer, RelatedWelcomerModel, CompleteLeaver, RelatedLeaverModel, CompleteDM, RelatedDMModel } from "./index"

export const EmbedModel = z.object({
  id: z.number().int(),
  title: z.string().nullish(),
  description: z.string().nullish(),
  color: z.number().int().nullish(),
  timestamp: z.date().nullish(),
  created: z.date(),
  updated: z.date(),
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
  footer: RelatedEmbedFooterModel.nullish(),
  fields: RelatedEmbedFieldModel.array(),
  author: RelatedEmbedAuthorModel.nullish(),
  image: RelatedEmbedImageModel.nullish(),
  thumbnail: RelatedEmbedThumbnailModel.nullish(),
  welcomer: RelatedWelcomerModel.nullish(),
  leaver: RelatedLeaverModel.nullish(),
  DM: RelatedDMModel.nullish(),
}))
