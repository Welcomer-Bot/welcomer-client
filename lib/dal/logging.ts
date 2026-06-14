import "server-only";

import { ErrorCode, logError } from "@/lib/error";

/**
 * Centralized DAL error logging with structured context
 *
 * @param action - The DAL operation name (e.g., "getSources")
 * @param code - Standard ErrorCode enum value
 * @param error - The caught error object
 * @param context - Optional operation context (guildId, sourceId, etc.)
 */
export function logDalError(
  action: string,
  code: ErrorCode,
  error: unknown,
  context?: Record<string, unknown>,
): void {
  logError({
    timestamp: new Date().toISOString(),
    level: "error",
    message: `DAL operation failed: ${action}`,
    code,
    context: {
      action,
      ...context,
    },
    stack: error instanceof Error ? error.stack : undefined,
  });
}

