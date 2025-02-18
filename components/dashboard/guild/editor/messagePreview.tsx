import { generateImage } from "@/lib/discord/image";
import { BaseCardParams } from "@/lib/discord/schema";
import { LeaverStore } from "@/state/leaver";
import { WelcomerStore } from "@/state/welcomer";
import {
  DiscordImageAttachment,
  DiscordEmbed,
  DiscordEmbedDescription,
  DiscordEmbedField,
  DiscordEmbedFields,
  DiscordEmbedFooter,
  DiscordMessage,
  DiscordMessages,
} from "@skyra/discord-components-react";
import { useEffect, useState } from "react";
export default function MessagePreview({
  msg,
}: {
  msg: WelcomerStore | LeaverStore;
}) {
  const [image, setImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (msg.activeCard)
      generateImage(msg.activeCard as BaseCardParams).then(setImage);
  }, [msg.activeCard]);

  return (
    <>
      <DiscordMessages className="rounded-lg min-h-full">
        <DiscordMessage author="Welcomer" avatar="/logo32.svg" bot verified>
          {msg.content}
          {((msg.activeCardToEmbedId === -1 && msg.activeCard) ||
            (msg.activeCardToEmbedId == null &&
              msg.activeCard &&
              msg.activeCardId)) &&
            image && <DiscordImageAttachment url={image} width={300} />}
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
                    image={
                      msg.activeCardToEmbedId === index && image
                        ? image
                        : undefined
                    }
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
