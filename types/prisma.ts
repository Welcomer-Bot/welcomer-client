import { RESTPostAPIChannelMessageJSONBody } from "discord-api-types/v10";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace PrismaJson {
    type DiscordMessage = RESTPostAPIChannelMessageJSONBody;
  }
}

// This file must be a module.
export {};
