import { Welcomer } from "@/lib/discord/schema";
import {
  DiscordEmbed,
  DiscordEmbedDescription,
  DiscordEmbedField,
  DiscordEmbedFields,
  DiscordEmbedFooter,
  DiscordMessage,
  DiscordMessages,
} from "@skyra/discord-components-react";

export default function MessagePreview({ msg }: { msg: Welcomer }) {
  return (
    <>
      <DiscordMessages className="rounded-lg min-h-full">
        <DiscordMessage author="Welcomer" bot verified>
          <span
            dangerouslySetInnerHTML={{
              __html: msg.content || "",
            }}
          />
          <div>
            {msg.embeds &&
              msg.embeds.map((embed, index) => {
                return (
                  <DiscordEmbed
                    slot="embeds"
                    color={embed.color?.toString()}
                    key={index}
                    embedTitle={embed.title ?? undefined}
                    authorName={embed.author?.name ?? ""}
                    authorImage={embed.author?.iconUrl ?? undefined}
                    authorUrl={embed.author?.url ?? undefined}
                    url={embed.url ?? undefined}
                    thumbnail={embed.thumbnail ?? undefined}
                  >
                    <DiscordEmbedDescription slot="description">
                      {embed.description}
                    </DiscordEmbedDescription>
                    {embed.fields && (
                      <DiscordEmbedFields slot="fields">

                        {embed.fields.map((field, index) => (
                          <DiscordEmbedField
                          key={index}
                          inline={field.inline ?? undefined}
                          fieldTitle={field.name}
                          >
                            {field.value}
                          </DiscordEmbedField>
                        ))}
                        </DiscordEmbedFields>
                      
                    )}
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
                );
              })}
          </div>
        </DiscordMessage>
      </DiscordMessages>
    </>
  );
}
