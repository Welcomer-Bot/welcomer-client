

import Guild from "./discord/guild";
import User from "./discord/user";

export function getGuildIcon(guild: Guild) {
  return guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`: null;
}
export function getUserAvatar(user: User) {
  return user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "webp"}`
    : `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator) % 5}.png`;
}

export function getGuildBanner(guild: Guild) {
  return guild.banner
    ? `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.png`
    : "/logo256.svg";
}

export function getUniqueId(): number {
  return Math.floor(Math.random() * 1000000000);
}
