import { RESTPostAPIChannelMessageJSONBody, APIEmbed } from "discord.js";
import Guild from "./discord/guild";
import User from "./discord/user";

export function getGuildIcon(guild: Guild) {
  return guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`: null;
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

export function getUniqueId(): number {
  return Math.floor(Math.random() * 1000000000);
}

export const formatDiscordMessage = (message: RESTPostAPIChannelMessageJSONBody): RESTPostAPIChannelMessageJSONBody =>{
    return {
        content: message.content ?? undefined,
        embeds: message.embeds?.length ? message.embeds.map((e) => formatDiscordEmbed(e)) : undefined,
        components: message.components?.length ? message.components : undefined,
        attachments: message.attachments?.length ? message.attachments : undefined,
    }
}

export const formatDiscordEmbed = (embed: APIEmbed):APIEmbed => {
    return {
        title: embed.title ?? undefined,
        description: embed.description ?? undefined,
        url: embed.url ?? undefined,
        timestamp: embed.timestamp ?? undefined,
        color: embed.color ?? undefined,
        footer: embed.footer ?? undefined,
        image: embed.image ?? undefined,
        thumbnail: embed.thumbnail ?? undefined,
    }
}
