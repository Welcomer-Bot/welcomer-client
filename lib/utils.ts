import Guild from "./discord/guild";
import User from "./discord/user";

export function getGuildIcon(guild: Guild) {
  return guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null;
}
export function getUserAvatar(user: User) {
  return user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}`
    : `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator) % 5}.png`;
}

export function getGuildBanner(guild: Guild) {
  return guild.banner
    ? `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.png`
    : "/logo256.svg";
}

export type StatsRange = "7d" | "30d" | "all";

export type GuildStatsSummary = {
  joins: number;
  leaves: number;
  messages: number;
  embeds: number;
  images: number;
};
/**
 * One day of the selected window. `date` is ISO `YYYY-MM-DD`; `memberCount` is
 * null when no snapshot exists for that day, which charts read as a gap.
 */
export type MemberPoint = {
  date: string;
  memberCount: number | null;
};

export type GuildStats = GuildStatsSummary & {
  series: MemberPoint[];
};

export const RANGE_DAYS: Record<StatsRange, number | null> = {
  "7d": 7,
  "30d": 30,
  all: null,
};
