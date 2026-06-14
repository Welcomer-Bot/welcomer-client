/**
 * Data Access Layer (DAL) - Main entry point
 *
 * Exports all DAL functions organized by domain:
 * - Discord API integration (discord.ts)
 * - Session & user management (session.ts)
 * - Source & image card operations (sources.ts)
 * - Structured error logging (logging.ts)
 *
 * All functions run in "use server" + "server-only" context
 *
 * Usage:
 * ```typescript
 * import { getUserGuild } from "@/lib/dal/session";
 * import { getSources } from "@/lib/dal/sources";
 * import { logDalError } from "@/lib/dal/logging";
 * ```
 *
 * Internal modules can be imported directly if needed:
 * ```typescript
 * import { getGuild } from "@/lib/dal/discord";
 * ```
 */

import "server-only";

export * from "@/lib/dal/logging";
export * from "@/lib/dal/sources";
export * from "@/lib/dal/discord";
export * from "@/lib/dal/session";
