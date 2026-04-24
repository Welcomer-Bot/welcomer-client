/**
 * Data Access Layer (DAL) - Centralized exports
 *
 * This module re-exports all DAL functions organized by domain:
 * - Discord API integration (discord.ts)
 * - Session & user management (session.ts)
 * - Source & image card operations (sources.ts)
 * - Structured error logging (logging.ts)
 *
 * All DAL functions run in "use server" + "server-only" context
 * with centralized error handling via logDalError()
 */

// Discord API integration
export {
  getGuild,
  leaveGuild,
  getChannels,
  getMemberPermissions,
  getRolesPermissions,
  getChannelData,
  getUserByAccessToken,
  getUserGuildsByAccessToken,
  getBot,
  getBotGuilds,
} from "@/lib/dal/discord";

// Session & user management
export {
  verifySession,
  getSessionData,
  getSessionDataById,
  getUser,
  fetchUserFromSession,
  getUserGuilds,
  getGuilds,
  getUserGuild,
  getUsers,
  getUserDataById,
  getUserData,
  getGuildData,
  getGuildsByUserId,
  createDBSession,
  isPremiumGuild,
  setPremiumGuild,
  getBetaTester,
} from "@/lib/dal/session";

// Source & image card operations
export {
  getSources,
  getSource,
  getLatestGuildStats,
  createGuildStats,
  createModuleStats,
  createSource,
  deleteSource,
  updateSourceQuery,
  deleteSourceQuery,
  deleteCardQuery,
  updateImageCardQuery,
  createImageCardQuery,
  executeQueries,
  getGuildBeta,
  addGuildToBeta,
  removeGuildToBeta,
  getAllGuildStatsSinceTime,
} from "@/lib/dal/sources";

// Error logging
export { logDalError } from "@/lib/dal/logging";

