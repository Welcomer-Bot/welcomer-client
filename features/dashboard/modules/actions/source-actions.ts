"use server";

import { revalidatePath } from "next/cache";
import { MessageBuilder, ValidationError } from "@discordjs/builders";
import z from "zod";

import { Source } from "@/generated/prisma/client";
import { SourceType } from "@/generated/prisma/enums";
import { SourceState } from "@/features/dashboard/modules/stores";
import { deleteActiveImageCardInternal } from "@/features/dashboard/modules/actions/image-card-actions";
import {
  AppError,
  ErrorCode,
  assertSnowflake,
  handleServerError,
  logError,
  reportError,
} from "@/lib/error";
import {
  createSource as createSourceRequest,
  deleteSource,
  getSource,
  updateSourceQuery,
} from "@/lib/dal/sources";
import { getUserGuild } from "@/lib/dal/session";

type UpdateSourceResult = {
  data: Source | null;
  done: boolean;
  error: string | null;
};

function sourceUpdateError(message: string): UpdateSourceResult {
  return { data: null, done: false, error: message };
}

function sourceUpdateSuccess(data: Source): UpdateSourceResult {
  return { data, done: true, error: null };
}

/**
 * Create a new source module for a guild.
 *
 * Permissions:
 * - Requires user access to the target guild via `getUserGuild(guildId)`.
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

  const guild = await getUserGuild(guildId);
  if (!guild) {
    throw new AppError(
      "You do not have permission to manage this guild",
      ErrorCode.PERMISSION_DENIED,
      403,
      { guildId, source },
    );
  }

  try {
    await createSourceRequest(guild.id, source);
    revalidatePath(`/dashboard/${guildId}`);
  } catch (error) {
    const appError = handleServerError(error, {
      action: "createSource",
      guildId,
      source,
    });
    reportError(appError);
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
 * - Requires user access to the target guild via `getUserGuild(guildId)`.
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

  const guild = await getUserGuild(guildId);
  if (!guild) {
    throw new AppError(
      "You do not have permission to manage this guild",
      ErrorCode.PERMISSION_DENIED,
      403,
      { guildId, sourceId },
    );
  }

  try {
    await deleteSource(guildId, sourceId);
    revalidatePath(`/dashboard/${guildId}`);
  } catch (error) {
    const appError = handleServerError(error, {
      action: "removeSource",
      guildId,
      sourceId,
    });
    reportError(appError);
    throw appError;
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
export async function updateSource(store: Partial<SourceState>): Promise<UpdateSourceResult> {
  const guildId = store.guildId;
  const sourceId = store.id;

  if (!guildId) {
    return sourceUpdateError("You need to select a guild");
  }
  if (!sourceId) {
    return sourceUpdateError("You need to select a source");
  }

  const guild = await getUserGuild(guildId);
  if (!guild) {
    return sourceUpdateError("You do not have permission to manage this guild");
  }

  if (!store.channelId) {
    return sourceUpdateError("You need to select a channel");
  }
  if (!store.message) {
    return sourceUpdateError("Message cannot be null");
  }

  const source = await getSource(guildId, sourceId);
  if (!source) {
    return sourceUpdateError("Source not found for this guild");
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

      return sourceUpdateError(z.prettifyError(error.cause));
    }

    const appError = handleServerError(error, {
      action: "updateSource.validateMessage",
      guildId,
      sourceId,
    });
    reportError(appError);

    return sourceUpdateError("Message is not valid");
  }

  let updatedMessage = store.message;
  if (store.imagePosition === "embed" && store.imageEmbedIndex !== undefined) {
    const currentMessage = store.message;
    const embed = currentMessage?.embeds?.[store.imageEmbedIndex];
    if (!embed) {
      return sourceUpdateError("Embed index for image is invalid");
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
    return sourceUpdateSuccess(updatedSource);
  } catch (error) {
    const appError = handleServerError(error, {
      action: "updateSource",
      guildId,
      sourceId,
    });
    reportError(appError);

    return sourceUpdateError(
      appError.message || "An error occurred while updating the source",
    );
  }
}


