import { GuildObject } from "./guild";
import { UserObject } from "./user";

export function parseText(text: string, user: UserObject, guild: GuildObject) {
  return text
    .replaceAll(/{user}/g, user.username!)
    .replaceAll(/{id}/g, user.id)
    .replaceAll(/{displayname}/g, user.username!)
    .replaceAll(/{discriminator}/g, user.discriminator!)
    .replaceAll(/{guild}/g, guild.name)
    .replaceAll(/{membercount}/g, guild.memberCount.toString());
}
