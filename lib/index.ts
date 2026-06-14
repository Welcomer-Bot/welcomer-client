/**
 * lib/ - Centralized library exports
 *
 * This module organizes the main library interfaces:
 * - `dal` - Data Access Layer (Prisma, Discord, Session)
 * - `error` - Error handling & logging infrastructure
 * - `session` - JWT session management
 * - `validator` - Zod validation schemas
 * - `dto` - Data Transfer Objects
 * - `discord/*` - Discord API client classes
 *
 * Most code should import from DAL subpaths (`@/lib/dal/session`,
 * `@/lib/dal/sources`, `@/lib/dal/discord`) and `@/lib/error`.
 * This file is primarily for documentation and type definitions.
 *
 * @example
 * // Prefer specific imports:
 * import { getUserGuild } from "@/lib/dal/session";
 * import { createSource } from "@/lib/dal/sources";
 * import { AppError, ErrorCode } from "@/lib/error";
 *
 * // Over barrel imports:
 * import * from "@/lib";  // ❌ Avoid - brings in everything
 */

// Re-export main modules for convenience if needed
export * from "@/lib/dal/discord";
export * from "@/lib/dal/session";
export * from "@/lib/dal/sources";
export * from "@/lib/error";

