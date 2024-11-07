import { User } from "@prisma/client";

import { GuildExtended } from "@/types";

export function getGuildIcon(guild: GuildExtended) {
  return guild.icon
    ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
    : "/logo32.svg";
}

export function getUserAvatar(user: User) {
  return user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator) % 5}.png`;
}

export function getGuildBanner(guild: GuildExtended) {
  return guild.banner
    ? `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.png`
    : getGuildIcon(guild);
}

export function getUniqueId(): number {
  return Math.floor(Math.random() * 1000000000);
}
