import { User, Guild } from "@prisma/client";

export async function parseText(text: string, user: User, guild: Guild) {
  return text
    .replaceAll(/{user}/g, user.username!)
    .replaceAll(/{id}/g, user.id)
    .replaceAll(/{displayname}/g, user.username!)
    .replaceAll(/{discriminator}/g, user.discriminator!)
    .replaceAll(/{guild}/g, guild.name)
    .replaceAll(/{membercount}/g, "256");
}
