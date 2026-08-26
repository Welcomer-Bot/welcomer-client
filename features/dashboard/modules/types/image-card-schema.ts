import { z } from "zod";

import { TEXT_SIZE_MAX, TEXT_SIZE_MIN } from "./image-card";

/**
 * Runtime schema for an image card's persisted config.
 *
 * `BaseCardConfig` ships from `@welcomer-bot/card-canvas` as a compile-time
 * type only, so `updateImageCard` had nothing to check its payload against and
 * wrote `store.data as object` straight into the JSON column. This is that
 * missing check, shared by the server action and the editor's save gate.
 *
 * The bounds are not cosmetic. `backgroundImgURL` is handed to the renderer's
 * `loadImageSafe`, which runs server-side in the bot as well as in the browser:
 * an unconstrained string there is an SSRF vector, hence the http(s) filter.
 * The length and size caps stop a hand-made payload from bloating the JSON
 * column or asking the canvas for a 10^9 px font.
 *
 * `avatarImgURL` and `renderer` are deliberately absent. Both are injected at
 * render time by `lib/discord/image.ts`, spread after the stored config so they
 * override it anyway — persisting them is dead weight and, for the URL, a
 * second SSRF surface. `z.object` strips unknown keys, so a payload carrying
 * one is normalised rather than rejected.
 */

/** CSS colour strings: `rgba(255, 255, 255, 0.5)` is 24 chars, 64 is slack. */
const colorSchema = z.string().max(64).nullable().optional();

/**
 * The editor writes `""` when image mode is switched on before a URL is typed,
 * and `background-editor.tsx` tells it apart from `null` to keep the toggle
 * open. Rejecting it would fail the save on a legitimate UI state.
 */
// ponytail: the protocol filter blocks `javascript:` and `file:`, not a link
// to a private address such as the cloud metadata endpoint. Pinning that down
// belongs in whatever performs the fetch — DNS rebinding and redirects walk
// straight past a schema-level allowlist. Add egress filtering there if the
// renderer ever runs somewhere with credentials worth reaching.
const backgroundImgUrlSchema = z
  .union([z.url({ protocol: /^https?$/ }).max(2048), z.literal("")])
  .nullable()
  .optional();

/** Font family names are free-form: the lib's own default, `Nunito`, is not in `FONT_OPTIONS`. */
const fontSchema = z.string().max(64).optional();

const textCardSchema = z.object({
  // `setTextField` seeds `content: ""` when a field is first touched.
  content: z.string().max(500),
  color: colorSchema,
  font: fontSchema,
  size: z.number().min(TEXT_SIZE_MIN).max(TEXT_SIZE_MAX).optional(),
  weight: z.string().max(16).optional(),
});

export const imageCardConfigSchema = z.object({
  mainText: textCardSchema.nullable().optional(),
  nicknameText: textCardSchema.nullable().optional(),
  secondText: textCardSchema.nullable().optional(),
  backgroundColor: colorSchema,
  backgroundImgURL: backgroundImgUrlSchema,
  avatarBorderColor: colorSchema,
  fontDefault: fontSchema,
  colorTextDefault: colorSchema,
});

export type ImageCardConfig = z.infer<typeof imageCardConfigSchema>;
