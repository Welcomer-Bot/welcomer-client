"use server";

import { revalidatePath } from "next/cache";

import { ImageCard } from "@/generated/prisma/client";
import { ImageCardState } from "@/features/dashboard/modules/stores";
import {
  assertSnowflake,
  reportServerError,
} from "@/lib/error";
import { getUserGuild } from "@/lib/dal/session";
import {
  createImageCardQuery,
  deleteCardQuery,
  getImageCardForGuild,
  getSource,
  updateImageCardQuery,
  updateSourceQuery,
} from "@/lib/dal/sources";

type ImageCardMutationResult = {
  data: ImageCard | null;
  done: boolean;
  error: string | null;
};

type ImageCardDeleteResult = {
  done: boolean;
  error: string | null;
};

function imageCardError(message: string): ImageCardMutationResult {
  return { data: null, done: false, error: message };
}

function imageCardSuccess(data: ImageCard): ImageCardMutationResult {
  return { data, done: true, error: null };
}

function imageCardDeleteError(message: string): ImageCardDeleteResult {
  return { done: false, error: message };
}

function imageCardDeleteSuccess(): ImageCardDeleteResult {
  return { done: true, error: null };
}

/**
 * Create a new image card for a source in a guild.
 *
 * Permissions:
 * - Requires user access to the target guild.
 *
 * Validation:
 * - `guildId` must be a valid Discord snowflake.
 * - `sourceId` must exist in the provided guild scope.
 *
 * Side effects:
 * - Creates a new image card with empty data payload.
 * - Sets source active card if none exists.
 */
export async function createImageCard(
  sourceId: number,
  guildId: string,
): Promise<ImageCardMutationResult> {
  assertSnowflake(guildId, "guildId");

  const guild = await getUserGuild(guildId);
  if (!guild) {
    return imageCardError("You do not have permission to manage this guild");
  }

  try {
    const source = await getSource(guildId, sourceId);
    if (!source) {
      return imageCardError("Source not found for this guild");
    }

    const card = await createImageCardQuery({
      sourceId,
      data: {},
    });

    if (!source.activeCardId) {
      await updateSourceQuery(source, { activeCardId: card.id });
    }

    return imageCardSuccess(card);
  } catch (error) {
    const appError = reportServerError(error, {
      action: "createImageCard",
      guildId,
      sourceId,
    });

    return imageCardError(appError.message);
  }
}

/**
 * Update an existing image card for a guild-scoped source.
 *
 * Permissions:
 * - Requires user access to the target guild.
 *
 * Validation:
 * - `guildId` must be a valid Discord snowflake.
 * - `cardId`, `sourceId`, and `store.data` are required.
 */
export async function updateImageCard(
  store: Partial<ImageCardState>,
  guildId: string,
): Promise<ImageCardMutationResult> {
  assertSnowflake(guildId, "guildId");

  const cardId = store.id;
  const sourceId = store.sourceId;

  if (!cardId) {
    return imageCardError("You need to select a card");
  }

  if (!sourceId) {
    return imageCardError("You need to select a source");
  }

  const guild = await getUserGuild(guildId);
  if (!guild) {
    return imageCardError("You do not have permission to manage this guild");
  }

  if (!store.data) {
    return imageCardError("Card data cannot be null");
  }

  try {
    const card = await getImageCardForGuild(guildId, cardId);
    if (!card) {
      return imageCardError("Card not found for this guild");
    }

    const updatedCard = await updateImageCardQuery(card, {
      data: store.data as object,
    });

    revalidatePath(`/dashboard/${guildId}`);
    return imageCardSuccess(updatedCard);
  } catch (error) {
    const appError = reportServerError(error, {
      action: "updateImageCard",
      guildId,
      sourceId,
      cardId,
    });

    return imageCardError(appError.message);
  }
}

/**
 * Internal helper to delete a card after guild permission checks.
 */
async function deleteImageCardInternal(
  cardId: number,
  guildId: string,
): Promise<ImageCardDeleteResult> {
  const guild = await getUserGuild(guildId);
  if (!guild) {
    return imageCardDeleteError("You do not have permission to manage this guild");
  }

  try {
    const card = await getImageCardForGuild(guildId, cardId);
    if (!card) {
      return imageCardDeleteError("Card not found for this guild");
    }

    await deleteCardQuery(card);

    return imageCardDeleteSuccess();
  } catch (error) {
    const appError = reportServerError(error, {
      action: "deleteImageCardInternal",
      guildId,
      cardId,
    });

    return imageCardDeleteError(appError.message);
  }
}

// Internal helper reused by source update flow.
export async function deleteActiveImageCardInternal(
  sourceId: number,
  guildId: string,
): Promise<ImageCardDeleteResult> {
  const guild = await getUserGuild(guildId);
  if (!guild) {
    return imageCardDeleteError("You do not have permission to manage this guild");
  }

  try {
    const source = await getSource(guildId, sourceId);

    if (!source?.activeCardId) {
      return imageCardDeleteError("No active card to delete");
    }

    return await deleteImageCardInternal(source.activeCardId, guildId);
  } catch (error) {
    const appError = reportServerError(error, {
      action: "deleteActiveImageCardInternal",
      guildId,
      sourceId,
    });

    return imageCardDeleteError(appError.message);
  }
}

/**
 * Delete a source active image card and revalidate dashboard on success.
 */
export async function deleteActiveImageCard(
  sourceId: number,
  guildId: string,
): Promise<ImageCardDeleteResult> {
  assertSnowflake(guildId, "guildId");

  const result = await deleteActiveImageCardInternal(sourceId, guildId);
  if (result.done) {
    revalidatePath(`/dashboard/${guildId}`);
  }
  return result;
}

/**
 * Delete a specific image card and revalidate dashboard on success.
 */
export async function deleteImageCard(
  cardId: number,
  guildId: string,
): Promise<ImageCardDeleteResult> {
  assertSnowflake(guildId, "guildId");

  const result = await deleteImageCardInternal(cardId, guildId);
  if (result.done) {
    revalidatePath(`/dashboard/${guildId}`);
  }
  return result;
}


