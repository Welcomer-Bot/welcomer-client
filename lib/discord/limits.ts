/**
 * Discord's length limits for message and embed fields.
 *
 * The server is what enforces them — `updateSource` runs the payload through
 * `MessageBuilder`, which rejects anything out of bounds. These exist so the
 * editor can show a live counter and refuse the input before the round-trip.
 *
 * They are written out rather than derived: `discord-api-types` ships the
 * payload shapes but not the bounds, and `@discordjs/builders` only carries
 * them inside a 1.4 MB package that has no business in the client bundle.
 *
 * @see https://discord.com/developers/docs/resources/message#embed-object-embed-limits
 */
export const MESSAGE_LIMITS = {
  content: 2000,
} as const;

export const EMBED_LIMITS = {
  title: 256,
  description: 4096,
  authorName: 256,
  footerText: 2048,
  fieldName: 256,
  fieldValue: 1024,
} as const;
