import { BaseMessageOptions } from "discord.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace PrismaJson {
    type DiscordMessage = BaseMessageOptions;
  }
}

// This file must be a module.
export {};
