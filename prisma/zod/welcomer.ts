import * as z from "zod"
import * as imports from "../null"
import { CompleteGuild, RelatedGuildModel, CompleteEmbed, RelatedEmbedModel, CompleteDM, RelatedDMModel } from "./index"

export const WelcomerModel = z.object({
  id: z.number().int().nullish(),
  guildId: z.string(),
  channelId: z.string().nullish(),
  content: z.string().nullish(),
  created: z.date().nullish(),
  updated: z.date().nullish(),
})

export interface CompleteWelcomer extends z.infer<typeof WelcomerModel> {
  guild?: CompleteGuild | null
  embeds: CompleteEmbed[]
  DM?: CompleteDM | null
}

/**
 * RelatedWelcomerModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedWelcomerModel: z.ZodSchema<CompleteWelcomer> = z.lazy(() => WelcomerModel.extend({
  guild: RelatedGuildModel.nullish().nullish(),
  embeds: RelatedEmbedModel.array().max(10),
  DM: RelatedDMModel.nullish(),
}))
