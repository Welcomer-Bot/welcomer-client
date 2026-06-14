"use server";

import { revalidatePath } from "next/cache";

import { ImageCard } from "@/generated/prisma/client";
import { ImageCardState } from "@/features/dashboard/modules/stores";
import {
  ActionResult,
  VoidActionResult,
  actionError,
  actionSuccess,
  voidActionError,
  voidActionSuccess,
} from "@/features/dashboard/modules/actions/result";
import {
  assertSnowflake,
  reportServerError,
} from "@/lib/error";
import { requireGuild } from "@/lib/dal/session";
import {
  createImageCardQuery,
  deleteCardQuery,
  getImageCardForGuild,
  getSource,
  updateImageCardQuery,
  updateSourceQuery,
} from "@/lib/dal/sources";

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
): Promise<ActionResult<ImageCard>> {
  assertSnowflake(guildId, "guildId");

  try {
    await requireGuild(guildId);

    const source = await getSource(guildId, sourceId);
    if (!source) {
      return actionError("Source not found for this guild");
    }

    const card = await createImageCardQuery({
      sourceId,
      data: {},
    });

    if (!source.activeCardId) {
      await updateSourceQuery(source, { activeCardId: card.id });
    }

    return actionSuccess(card);
  } catch (error) {
    const appError = reportServerError(error, {
      action: "createImageCard",
      guildId,
      sourceId,
    });

    return actionError(appError.message);
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
): Promise<ActionResult<ImageCard>> {
  assertSnowflake(guildId, "guildId");

  const cardId = store.id;
  const sourceId = store.sourceId;

  if (!cardId) {
    return actionError("You need to select a card");
  }

  if (!sourceId) {
    return actionError("You need to select a source");
  }

  if (!store.data) {
    return actionError("Card data cannot be null");
  }

  try {
    await requireGuild(guildId);

    const card = await getImageCardForGuild(guildId, cardId);
    if (!card) {
      return actionError("Card not found for this guild");
    }

    const updatedCard = await updateImageCardQuery(card, {
      data: store.data as object,
    });

    revalidatePath(`/dashboard/${guildId}`);
    return actionSuccess(updatedCard);
  } catch (error) {
    const appError = reportServerError(error, {
      action: "updateImageCard",
      guildId,
      sourceId,
      cardId,
    });

    return actionError(appError.message);
  }
}

/**
 * Internal helper to delete a card after guild permission checks.
 */
async function deleteImageCardInternal(
  cardId: number,
  guildId: string,
): Promise<VoidActionResult> {
  try {
    await requireGuild(guildId);

    const card = await getImageCardForGuild(guildId, cardId);
    if (!card) {
      return voidActionError("Card not found for this guild");
    }

    await deleteCardQuery(card);

    return voidActionSuccess();
  } catch (error) {
    const appError = reportServerError(error, {
      action: "deleteImageCardInternal",
      guildId,
      cardId,
    });

    return voidActionError(appError.message);
  }
}

// Internal helper reused by source update flow.
// Delegates to deleteImageCardInternal which enforces the guild permission check.
export async function deleteActiveImageCardInternal(
  sourceId: number,
  guildId: string,
): Promise<VoidActionResult> {
  try {
    const source = await getSource(guildId, sourceId);

    if (!source?.activeCardId) {
      return voidActionError("No active card to delete");
    }

    return await deleteImageCardInternal(source.activeCardId, guildId);
  } catch (error) {
    const appError = reportServerError(error, {
      action: "deleteActiveImageCardInternal",
      guildId,
      sourceId,
    });

    return voidActionError(appError.message);
  }
}

/**
 * Delete a source active image card and revalidate dashboard on success.
 */
export async function deleteActiveImageCard(
  sourceId: number,
  guildId: string,
): Promise<VoidActionResult> {
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
): Promise<VoidActionResult> {
  assertSnowflake(guildId, "guildId");

  const result = await deleteImageCardInternal(cardId, guildId);
  if (result.done) {
    revalidatePath(`/dashboard/${guildId}`);
  }
  return result;
}


