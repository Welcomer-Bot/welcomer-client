import { Welcomer } from "@/lib/discord/schema"
import { DiscordEmbed, DiscordEmbedDescription, DiscordMessage, DiscordMessages } from "@skyra/discord-components-react"

export default function MessagePreview({ msg }: { msg: Welcomer }) { 
    return (
      <>
        <DiscordMessages>
          <DiscordMessage author="Welcomer">
            <span
              dangerouslySetInnerHTML={{
                __html: msg.content || "",
              }}
            />
            {msg.embeds.length > 0  && msg.embeds.map((embed, index) => (
              <DiscordEmbed
                slot="embeds"
                color={embed.color?.toString()}
                key={index}
                embedTitle={embed.title!}
              >
                <DiscordEmbedDescription slot="description">
                  {embed.description}
                </DiscordEmbedDescription>
              </DiscordEmbed>
            ))}
          </DiscordMessage>
        </DiscordMessages>
      </>
    );
}