import { Welcomer } from "@/lib/discord/schema";
import {
  DiscordEmbed,
  DiscordEmbedDescription,
  DiscordEmbedFooter,
  DiscordMessage,
  DiscordMessages,
} from "@skyra/discord-components-react";

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
          {msg.embeds.length > 0 &&
            msg.embeds.map((embed, index) => (
              <DiscordEmbed
                slot="embeds"
                color={embed.color?.toString()}
                key={index}
                embedTitle={embed.title ?? undefined}
                authorName={embed.author?.name ?? undefined}
                authorImage={embed.author?.iconUrl ?? undefined}
                authorUrl={embed.author?.url ?? undefined}
                url={embed.url ?? undefined}
                thumbnail={embed.thumbnail ?? undefined}
              >
                <DiscordEmbedDescription slot="description">
                  {embed.description}
                </DiscordEmbedDescription>
                <DiscordEmbedFooter
                  slot="footer"
                  footerImage={embed.footer?.iconUrl ?? undefined}
                  timestamp={
                    embed.timestampNow
                      ? new Date().toISOString()
                      : embed.timestamp
                  }
                >
                  {embed.footer?.text}
                </DiscordEmbedFooter>
              </DiscordEmbed>
            ))}
        </DiscordMessage>
      </DiscordMessages>
    </>
  );
}
