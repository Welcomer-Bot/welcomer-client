import { EmbedModel, WelcomerModel } from '@/prisma/zod';
import * as z from 'zod';


export type Welcomer = z.infer<typeof WelcomerModel>;
export type Embed = z.infer<typeof EmbedModel>;