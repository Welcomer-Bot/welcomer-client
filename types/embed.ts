import { APIEmbed, APIEmbedField } from "discord-api-types/v10";

export const defaultEmbedField: APIEmbedField = {
  name: "Member count",
  value: "{membercount}",
};

export const defaultWelcomeEmbed: APIEmbed = {
  title: "Welcome to the server",
  description: "Welcome {user} to {guild}",
  fields: [defaultEmbedField],
};

export const defaultLeaverEmbed: APIEmbed = {
  title: "Goodbye from the server",
  description: "Goodbye {user} from {guild}",
  fields: [defaultEmbedField],
};
