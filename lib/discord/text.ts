import { GuildObject } from "./guild";
import { UserObject } from "./user";

export function parseText(text: string, user: UserObject, guild: GuildObject) {
  //TODO: add all the other variables
  return text
    .replaceAll(/{user}/g, user.username)
    .replaceAll(/{id}/g, user.id)
    .replaceAll(/{displayname}/g, user.username)
    .replaceAll(/{discriminator}/g, user.discriminator)
    .replaceAll(/{guild}/g, guild.name)
    .replaceAll(/{membercount}/g, guild.memberCount.toString())
    .replaceAll(/{guildid}/g, guild.id)
    .replaceAll(/{username}/g, user.username)
    .replaceAll(/{membercount}/g, guild.memberCount.toString());
}
