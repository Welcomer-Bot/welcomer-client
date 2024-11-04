import * as z from "zod"
import * as imports from "../null"
import { CompleteEmbedFooter, RelatedEmbedFooterModel, CompleteEmbedField, RelatedEmbedFieldModel, CompleteEmbedAuthor, RelatedEmbedAuthorModel, CompleteEmbedImage, RelatedEmbedImageModel, CompleteWelcomer, RelatedWelcomerModel, CompleteLeaver, RelatedLeaverModel, CompleteDM, RelatedDMModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const EmbedModel = z.object({
  id: z.number().int().optional(),
  title: z.string().nullish(),
  description: z.string().nullish(),
  color: z.number().int().nullish(),
  timestamp: jsonSchema.optional(),
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
  footer: RelatedEmbedFooterModel.optional().nullish(),
  fields: RelatedEmbedFieldModel.array().optional(),
  author: RelatedEmbedAuthorModel.optional().nullish(),
  image: RelatedEmbedImageModel.optional().nullish(),
  welcomer: RelatedWelcomerModel.optional().nullish(),
  leaver: RelatedLeaverModel.optional().nullish(),
  DM: RelatedDMModel.optional().nullish(),
}))
