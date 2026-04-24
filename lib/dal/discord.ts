import "server-only";

import { cache } from "react";
import { REST } from "@discordjs/rest";
import {
  type RESTError,
  RESTGetAPICurrentUserGuildsResult,
  RESTGetAPIGuildChannelsResult,
  RESTGetAPIGuildMemberResult,
  type RESTGetAPIGuildResult,
  RESTGetAPIGuildRolesResult,
  RESTGetAPIUserResult,
  Routes,
} from "discord-api-types/v10";

import { ErrorCode } from "@/lib/error";
import { logDalError } from "./logging";
import Guild from "@/lib/discord/guild";
import { canManageGuild } from "@/lib/discord/permissions";
import rest from "@/lib/discord/rest";
import User from "@/lib/discord/user";

/**
 * Fetch guild data with member/channel counts
 *
 * @param guildId - Discord guild ID
 * @returns Guild instance or null if not found/error
 */
export const getGuild = cache(async (guildId: string) => {
  try {
    const data = (await rest.get(
      `${Routes.guild(guildId)}?with_counts=true`,
    )) as RESTGetAPIGuildResult | RESTError;
    if (!data || "message" in data) return null;

    return new Guild(data);
  } catch (error) {
    logDalError("getGuild", ErrorCode.EXTERNAL_API_ERROR, error, {
      guildId,
    });
    return null;
  }
});

/**
 * Remove bot from a guild (user perspective)
 *
 * @param guildId - Discord guild ID
 * @returns true if successful, false otherwise
 */
export const leaveGuild = cache(async (guildId: string) => {
  try {
    const data = (await rest.delete(`${Routes.userGuild(guildId)}`)) as
      | RESTGetAPIGuildResult
      | RESTError;
    if (!data || "message" in data) return false;

    return !!data;
  } catch (error) {
    logDalError("leaveGuild", ErrorCode.EXTERNAL_API_ERROR, error, {
      guildId,
    });
    return false;
  }
});

/**
 * Fetch all channels in a guild
 *
 * @param guildId - Discord guild ID
 * @returns Array of channel objects or null if error
 */
export const getChannels = cache(async (guildId: string) => {
  try {
    const data = (await rest.get(
      `${Routes.guildChannels(guildId)}?with_counts=true`,
    )) as RESTGetAPIGuildChannelsResult | RESTError;
    if (!data || "message" in data) return null;

    return data;
  } catch (error) {
    logDalError("getChannels", ErrorCode.EXTERNAL_API_ERROR, error, {
      guildId,
    });
    return null;
  }
});

/**
 * Fetch bot member permissions in a guild
 *
 * @param guildId - Discord guild ID
 * @returns Member data with permissions or null
 */
export const getMemberPermissions = cache(async (guildId: string) => {
  try {
    const data = (await rest.get(
      Routes.guildMember(guildId, process.env.BOT_ID),
    )) as RESTGetAPIGuildResult | RESTError;
    if (!data || "message" in data) return null;
    return data;
  } catch (error) {
    logDalError("getMemberPermissions", ErrorCode.EXTERNAL_API_ERROR, error, {
      guildId,
    });
    return null;
  }
});

/**
 * Fetch all roles in a guild
 *
 * @param guildId - Discord guild ID
 * @returns Array of role objects or null
 */
export const getRolesPermissions = cache(async (guildId: string) => {
  try {
    const data = (await rest.get(Routes.guildRoles(guildId))) as
      | RESTGetAPIGuildRolesResult
      | RESTError;
    if (!data || "message" in data) return null;
    return data;
  } catch (error) {
    logDalError("getRolesPermissions", ErrorCode.EXTERNAL_API_ERROR, error, {
      guildId,
    });
    return null;
  }
});

/**
 * Fetch a specific channel's data
 *
 * @param channelId - Discord channel ID
 * @returns Channel data or null
 */
export const getChannelData = cache(async (channelId: string) => {
  try {
    const data = (await rest.get(Routes.channel(channelId))) as
      | RESTGetAPIGuildChannelsResult
      | RESTError;
    if (!data || "message" in data) return null;
    return data;
  } catch (error) {
    logDalError("getChannelData", ErrorCode.EXTERNAL_API_ERROR, error, {
      channelId,
    });
    return null;
  }
});

/**
 * Get current user from OAuth access token
 *
 * @param accessToken - OAuth2 access token
 * @returns User instance or null
 */
export const getUserByAccessToken = cache(async (accessToken: string) => {
  const restClient = new REST({ version: "10" }).setToken(accessToken);
  try {
    const data = (await restClient.get(Routes.user(), {
      auth: true,
      authPrefix: "Bearer",
    })) as RESTGetAPIUserResult | RESTError;
    if (!data || "message" in data) return null;

    return new User(data);
  } catch (error) {
    logDalError("getUserByAccessToken", ErrorCode.EXTERNAL_API_ERROR, error);
    return null;
  }
});

/**
 * Get user's accessible guilds (with MANAGE_GUILD permission or owner)
 *
 * @param accessToken - OAuth2 access token
 * @returns Array of Guild instances or null
 */
export const getUserGuildsByAccessToken = cache(
  async (accessToken: string) => {
    const restClient = new REST({ version: "10" }).setToken(accessToken);
    try {
      const data = (await restClient.get(
        `${Routes.userGuilds()}?with_counts=true`,
        {
          auth: true,
          authPrefix: "Bearer",
        },
      )) as RESTGetAPICurrentUserGuildsResult | RESTError;
      if (!data || "message" in data) return null;
      const guilds = data.filter(canManageGuild);
      return guilds.map((guild) => new Guild(guild));
    } catch (error) {
      logDalError(
        "getUserGuildsByAccessToken",
        ErrorCode.EXTERNAL_API_ERROR,
        error,
        {
          hasAccessToken: Boolean(accessToken),
        },
      );
      return null;
    }
  },
);

/**
 * Get bot member data in a specific guild
 *
 * @param guildId - Discord guild ID
 * @returns Guild member data or null
 */
export const getBot = cache(async (guildId: string) => {
  try {
    const data = (await rest.get(
      Routes.guildMember(guildId, process.env.BOT_ID),
    )) as RESTGetAPIGuildMemberResult | RESTError;
    if (!data || "message" in data) return null;
    return data;
  } catch (error) {
    logDalError("getBot", ErrorCode.EXTERNAL_API_ERROR, error, {
      guildId,
    });
    return null;
  }
});

/**
 * Fetch all bot's mutual guilds
 *
 * @returns Array of Guild instances or null
 */
export const getBotGuilds = cache(async () => {
  try {
    const data = (await rest.get(
      `${Routes.userGuilds()}?with_counts=true`,
    )) as RESTGetAPICurrentUserGuildsResult | RESTError;
    if (!data || "message" in data) return null;
    return data.map((guild) => {
      const guildObj = new Guild(guild);
      guildObj.setMutual(true);
      return guildObj;
    });
  } catch (error) {
    logDalError("getBotGuilds", ErrorCode.EXTERNAL_API_ERROR, error);
    return null;
  }
});

