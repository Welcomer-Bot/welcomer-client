import { EmbedModel, RelatedWelcomerModel } from "@/prisma/zod";
import * as z from "zod";

export type Welcomer = z.infer<typeof RelatedWelcomerModel>;
export type Embed = z.infer<typeof EmbedModel>;
