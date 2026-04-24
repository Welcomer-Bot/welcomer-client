"use server";

import { revalidatePath } from "next/cache";
import { MessageBuilder, ValidationError } from "@discordjs/builders";
import z from "zod";

import { Source } from "@/generated/prisma/client";
import { SourceType } from "@/generated/prisma/enums";
import { SourceState } from "@/features/dashboard/modules/stores";
import { deleteActiveImageCardInternal } from "@/features/dashboard/modules/actions/image-card-actions";
import {
  ActionResult,
  actionError,
  actionSuccess,
} from "@/features/dashboard/modules/actions/result";
import {
  AppError,
  ErrorCode,
  assertSnowflake,
  logError,
  reportServerError,
} from "@/lib/error";
import {
  createSource as createSourceRequest,
  deleteSource,
  getSource,
  updateSourceQuery,
} from "@/lib/dal/sources";
import { getUserGuild, requireGuild } from "@/lib/dal/session";

/**
 * Create a new source module for a guild.
 *
 * Permissions:
 * - Requires user access to the target guild via `requireGuild(guildId)`.
 *
 * Validation:
 * - `guildId` must be a valid Discord snowflake.
 *
 * Side effects:
 * - Persists a new source (with DAL defaults).
 * - Revalidates `/dashboard/:guildId` cache path.
 *
 * @throws AppError When permission is denied or creation fails.
 */
export async function createSource(guildId: string, source: SourceType): Promise<void> {
  assertSnowflake(guildId, "guildId");

  const guild = await requireGuild(guildId);

  try {
    await createSourceRequest(guild.id, source);
    revalidatePath(`/dashboard/${guildId}`);
  } catch (error) {
    const appError = reportServerError(error, {
      action: "createSource",
      guildId,
      source,
    });
    throw new AppError(
      "An error occurred while creating the source",
      appError.code,
      appError.statusCode,
      appError.context,
    );
  }
}

/**
 * Remove a source module from a guild.
 *
 * Permissions:
 * - Requires user access to the target guild via `requireGuild(guildId)`.
 *
 * Validation:
 * - `guildId` must be a valid Discord snowflake.
 *
 * Side effects:
 * - Deletes source from persistence layer.
 * - Revalidates `/dashboard/:guildId` cache path.
 *
 * @throws AppError When permission is denied or deletion fails.
 */
export async function removeSource(guildId: string, sourceId: number): Promise<void> {
  assertSnowflake(guildId, "guildId");

  await requireGuild(guildId);

  try {
    await deleteSource(guildId, sourceId);
    revalidatePath(`/dashboard/${guildId}`);
  } catch (error) {
    throw reportServerError(error, {
      action: "removeSource",
      guildId,
      sourceId,
    });
  }
}

/**
 * Update source channel and message payload from editor store state.
 *
 * Permissions:
 * - Requires user access to the target guild via `getUserGuild(guildId)`.
 *
 * Validation:
 * - Ensures guild, source, channel and message exist.
 * - Validates Discord message payload through `MessageBuilder`.
 *
 * Side effects:
 * - May clear active image card when image placement is unset.
 * - Persists updated source message/channel in database.
 * - Revalidates `/dashboard/:guildId` cache path.
 *
 * @returns Mutation result with `{ data, done, error }` contract.
 */
export async function updateSource(store: Partial<SourceState>): Promise<ActionResult<Source>> {
  const guildId = store.guildId;
  const sourceId = store.id;

  if (!guildId) {
    return actionError("You need to select a guild");
  }
  if (!sourceId) {
    return actionError("You need to select a source");
  }

  const guild = await getUserGuild(guildId);
  if (!guild) {
    return actionError("You do not have permission to manage this guild");
  }

  if (!store.channelId) {
    return actionError("You need to select a channel");
  }
  if (!store.message) {
    return actionError("Message cannot be null");
  }

  const source = await getSource(guildId, sourceId);
  if (!source) {
    return actionError("Source not found for this guild");
  }

  try {
    let embedIndex: number | undefined;

    store.message.embeds?.forEach((embed, i) => {
      if (embed.image && embed.image.url === "imageCard") {
        embed.image = undefined;
        embedIndex = i;
      }
    });

    new MessageBuilder(store.message).toJSON();

    store.message.embeds?.forEach((embed, i) => {
      if (
        embedIndex !== undefined &&
        i === embedIndex &&
        store.imagePosition === "embed"
      ) {
        embed.image = { url: "attachment://card.png" };
      }
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      logError({
        timestamp: new Date().toISOString(),
        level: "warn",
        message: "Invalid Discord message payload",
        code: ErrorCode.VALIDATION_ERROR,
        context: {
          action: "updateSource.validateMessage",
          guildId,
          sourceId,
          validationName: error.name,
        },
      });

      return actionError(z.prettifyError(error.cause));
    }

    reportServerError(error, {
      action: "updateSource.validateMessage",
      guildId,
      sourceId,
    });

    return actionError("Message is not valid");
  }

  let updatedMessage = store.message;
  if (store.imagePosition === "embed" && store.imageEmbedIndex !== undefined) {
    const currentMessage = store.message;
    const embed = currentMessage?.embeds?.[store.imageEmbedIndex];
    if (!embed) {
      return actionError("Embed index for image is invalid");
    }

    const embeds = [...(currentMessage.embeds ?? [])];
    embeds[store.imageEmbedIndex] = { ...embed, image: { url: "imageCard" } };
    updatedMessage = { ...currentMessage, embeds };
  }

  if (store.imageEmbedIndex === undefined && store.imagePosition === undefined) {
    await deleteActiveImageCardInternal(sourceId, guildId);
    store.imagePosition = undefined;
  }

  try {
    const updatedSource = await updateSourceQuery(source, {
      channelId: store.channelId,
      message: updatedMessage,
    });

    revalidatePath(`/dashboard/${guildId}`);
    return actionSuccess(updatedSource);
  } catch (error) {
    const appError = reportServerError(error, {
      action: "updateSource",
      guildId,
      sourceId,
    });

    return actionError(
      appError.message || "An error occurred while updating the source",
    );
  }
}


