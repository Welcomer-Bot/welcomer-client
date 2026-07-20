/**
 * Admin Server Actions
 *
 * Protected mutations for admin operations.
 * All functions enforce admin authorization via assertAdminUser().
 * All functions validate IDs and handle errors via lib/error.ts patterns.
 *
 * Error handling:
 * - assertAdminUser() throws AppError(PERMISSION_DENIED) if not admin
 * - assertSnowflake() throws AppError(INVALID_INPUT) if ID format invalid
 * - handleServerError() + reportError() wraps DB/API errors
 */

"use server";

import { GuildObject } from "@/lib/discord/guild";
import { revalidatePath } from "next/cache";
import { assertAdminUser } from "./guards";
import {
  addGuildToBeta,
  getGuild,
  getGuildsByUserId,
  removeGuildFromBeta,
} from "../dal";
import {
  AppError,
  ErrorCode,
  assertSnowflake,
  reportServerError,
} from "../error";

export async function getUserGuildsForAdmin(userId: string): Promise<GuildObject[]> {
  await assertAdminUser();
  assertSnowflake(userId, "userId");

  try {
    return (await getGuildsByUserId(userId)) ?? [];
  } catch (error) {
    throw reportServerError(error, {
      action: "getUserGuildsForAdmin",
      userId,
    });
  }
}

export async function removeGuildFromBetaProgram(guildId: string) {
  await assertAdminUser();
  assertSnowflake(guildId, "guildId");

  try {
    const res = await removeGuildFromBeta(guildId);
    revalidatePath("/admin");
    return res;
  } catch (error) {
    throw reportServerError(error, {
      action: "removeGuildFromBetaProgram",
      guildId,
    });
  }
}

export async function enrollGuildToBetaProgram(guildId: string, userId?: string) {
  await assertAdminUser();
  assertSnowflake(guildId, "guildId");
  if (userId) {
    assertSnowflake(userId, "userId");
  }

  try {
    const res = await addGuildToBeta(guildId, userId);
    revalidatePath("/admin");
    return res;
  } catch (error) {
    throw reportServerError(error, {
      action: "enrollGuildToBetaProgram",
      guildId,
      userId,
    });
  }
}

export async function leaveGuild(guildId: string) {
  await assertAdminUser();
  assertSnowflake(guildId, "guildId");

  try {
    const guild = await getGuild(guildId);
    if (!guild) {
      throw new AppError(
        "Guild not found",
        ErrorCode.GUILD_NOT_FOUND,
        404,
      );
    }
    const res = await guild.leave();
    revalidatePath("/admin");
    if (!res) {
      throw new AppError(
        "Failed to leave guild",
        ErrorCode.EXTERNAL_API_ERROR,
        502,
      );
    }
    return guild.toObject();
  } catch (error) {
    throw reportServerError(error, {
      action: "leaveGuild",
      guildId,
    });
  }
}
