import { User } from "@prisma/client";
import { getFonts } from "font-list";

import { GuildExtended } from "@/types";

export function getGuildIcon(guild: GuildExtended) {
  return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
}

export function getUserAvatar(user: User) {
  return user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator) % 5}.png`;
}

export function getGuildBanner(guild: GuildExtended) {
  return guild.banner
    ? `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.png`
    : "/logo32.svg"
}

export function getUniqueId(): number {
  return Math.floor(Math.random() * 1000000000);
}