"use server";

import { revalidatePath } from "next/cache";

import { ImageCard } from "@/generated/prisma/client";
import { ImageCardState } from "@/features/dashboard/modules/stores";
import { getDashboardModuleBySourceType } from "@/features/dashboard/modules/config";
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
import { getUserGuild } from "@/lib/dal/session";
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
 * - Requires user access to the target guild via `getUserGuild(guildId)`,
 *   checked before the try block so a permission failure returns its own
 *   distinct message instead of being folded into the generic technical
 *   error path below.
 *
 * Validation:
 * - `guildId` must be a valid Discord snowflake.
 * - `sourceId` must exist in the provided guild scope.
 *
 * Side effects:
 * - Creates a new image card with empty data payload.
 * - Sets source active card if none exists.
 * - Revalidates, as a 'layout' revalidation, the source's module editor and
 *   nested image editor routes (both read the active card).
 */
export async function createImageCard(
  sourceId: number,
  guildId: string,
): Promise<ActionResult<ImageCard>> {
  assertSnowflake(guildId, "guildId");

  const guild = await getUserGuild(guildId);
  if (!guild) {
    return actionError("You do not have permission to manage this guild");
  }

  try {
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

    // 'layout' cascades to the nested `.../image` route since both share
    // `[module]/layout.tsx` — the module editor's message preview also
    // renders the active card's data.
    const moduleConfig = getDashboardModuleBySourceType(source.type);
    if (moduleConfig) {
      revalidatePath(`/dashboard/${guildId}/${moduleConfig.slug}`, "layout");
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
 * - Requires user access to the target guild via `getUserGuild(guildId)`,
 *   checked before the try block so a permission failure returns its own
 *   distinct message instead of being folded into the generic technical
 *   error path below.
 *
 * Validation:
 * - `guildId` must be a valid Discord snowflake.
 * - `cardId`, `sourceId`, and `store.data` are required.
 *
 * Side effects:
 * - Revalidates, as a 'layout' revalidation, the source's module editor and
 *   nested image editor routes (both read the active card's data).
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

  const guild = await getUserGuild(guildId);
  if (!guild) {
    return actionError("You do not have permission to manage this guild");
  }

  try {
    const card = await getImageCardForGuild(guildId, cardId);
    if (!card) {
      return actionError("Card not found for this guild");
    }

    const updatedCard = await updateImageCardQuery(card, {
      data: store.data as object,
    });

    // Card data isn't exposed on the source row itself, so the source is
    // looked back up (ponytail: one extra cheap read, simpler than plumbing
    // sourceType through the store) purely to derive the module slug.
    const source = await getSource(guildId, sourceId);
    const moduleConfig = source && getDashboardModuleBySourceType(source.type);
    if (moduleConfig) {
      revalidatePath(`/dashboard/${guildId}/${moduleConfig.slug}`, "layout");
    }

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
 *
 * Permissions checked via `getUserGuild(guildId)` before the try block, so a
 * permission failure returns its own distinct message instead of being
 * folded into the generic technical error path below.
 */
async function deleteImageCardInternal(
  cardId: number,
  guildId: string,
): Promise<VoidActionResult> {
  const guild = await getUserGuild(guildId);
  if (!guild) {
    return voidActionError("You do not have permission to manage this guild");
  }

  try {
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
 * Delete a source's active image card and revalidate the affected routes on success.
 *
 * Side effects:
 * - Revalidates, as a 'layout' revalidation, the source's module editor and
 *   nested image editor routes (both read the active card). The guild
 *   overview doesn't render card data, so it is deliberately left alone.
 */
export async function deleteActiveImageCard(
  sourceId: number,
  guildId: string,
): Promise<VoidActionResult> {
  assertSnowflake(guildId, "guildId");

  const result = await deleteActiveImageCardInternal(sourceId, guildId);
  if (result.done) {
    // ponytail: cheap extra lookup (after the delete, since the card row
    // itself is gone) purely to derive the module slug for revalidation.
    const source = await getSource(guildId, sourceId);
    const moduleConfig = source && getDashboardModuleBySourceType(source.type);
    if (moduleConfig) {
      revalidatePath(`/dashboard/${guildId}/${moduleConfig.slug}`, "layout");
    }
  }
  return result;
}

/**
 * Delete a specific image card and revalidate the affected routes on success.
 *
 * Side effects:
 * - Revalidates, as a 'layout' revalidation, the owning source's module
 *   editor and nested image editor routes. The guild overview doesn't render
 *   card data, so it is deliberately left alone.
 */
export async function deleteImageCard(
  cardId: number,
  guildId: string,
): Promise<VoidActionResult> {
  assertSnowflake(guildId, "guildId");

  // ponytail: looked up before the delete (the card row won't exist
  // afterwards) purely to learn its sourceId for revalidation.
  // deleteImageCardInternal repeats this lookup internally — duplicating a
  // cheap scoped read is simpler than changing its shared return contract.
  const cardBeforeDelete = await getImageCardForGuild(guildId, cardId);

  const result = await deleteImageCardInternal(cardId, guildId);
  if (result.done && cardBeforeDelete) {
    const source = await getSource(guildId, cardBeforeDelete.sourceId);
    const moduleConfig = source && getDashboardModuleBySourceType(source.type);
    if (moduleConfig) {
      revalidatePath(`/dashboard/${guildId}/${moduleConfig.slug}`, "layout");
    }
  }
  return result;
}


