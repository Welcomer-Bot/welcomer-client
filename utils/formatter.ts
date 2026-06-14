import { RESTPostAPIChannelMessageJSONBody, APIEmbed } from "discord.js";


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