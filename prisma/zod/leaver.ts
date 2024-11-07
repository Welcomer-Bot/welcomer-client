import * as z from "zod"
import { CompleteGuild, RelatedGuildModel, CompleteEmbed, RelatedEmbedModel } from "./index"

export const LeaverModel = z.object({
  id: z.number().int(),
  guildId: z.string(),
  channelId: z.string().nullish(),
  content: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteLeaver extends z.infer<typeof LeaverModel> {
  guild: CompleteGuild
  embeds: CompleteEmbed[]
}

/**
 * RelatedLeaverModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedLeaverModel: z.ZodSchema<CompleteLeaver> = z.lazy(() => LeaverModel.extend({
  guild: RelatedGuildModel,
  embeds: RelatedEmbedModel.array(),
}))
