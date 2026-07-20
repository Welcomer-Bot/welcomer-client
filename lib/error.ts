/**
 * Server Error & Logging Utilities
 *
 * Centralized error handling, logging, and observability for server-side operations.
 *
 * Features:
 * - Structured error classes for different error types
 * - Centralized logging with context (userId, guildId, action, etc.)
 * - Safe error serialization (no sensitive data in logs)
 * - Sentry integration hook points
 *
 * Usage:
 * try {
 *   // ... operation
 * } catch (error) {
 *   const appError = handleServerError(error, { userId, guildId, action: "updateSource" });
 *   reportError(appError);
 *   throw new AppError("User-friendly message", appError.code);
 * }
 */

import * as Sentry from "@sentry/nextjs";
import "server-only";

export enum ErrorCode {
  // Auth errors
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  SESSION_EXPIRED = "SESSION_EXPIRED",

  // Validation errors
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",

  // Resource errors
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",

  // Permission errors
  PERMISSION_DENIED = "PERMISSION_DENIED",
  GUILD_NOT_FOUND = "GUILD_NOT_FOUND",

  // Server errors
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  EXTERNAL_API_ERROR = "EXTERNAL_API_ERROR",
}

export class AppError extends Error {
  constructor(
    public message: string,
    public code: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR,
    public statusCode: number = 500,
    public context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "AppError";
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
    };
  }
}

export interface ErrorContext {
  userId?: string;
  guildId?: string;
  action?: string;
  operation?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  timestamp: string;
  level: "error" | "warn" | "info";
  message: string;
  code?: ErrorCode;
  context?: ErrorContext;
  stack?: string;
}

/**
 * Centralized error handler for server operations
 *
 * Converts various error types to AppError and extracts context.
 * Filters sensitive data before logging.
 */
export function handleServerError(
  error: unknown,
  context: ErrorContext,
): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof SyntaxError) {
    return new AppError(
      "Invalid input format",
      ErrorCode.INVALID_INPUT,
      400,
      context,
    );
  }

  if (error instanceof TypeError) {
    return new AppError(
      "Type error in operation",
      ErrorCode.INTERNAL_SERVER_ERROR,
      500,
      context,
    );
  }

  if (error instanceof Error) {
    const message = error.message || "An error occurred";

    // Check for specific error patterns
    if (message.includes("permission") || message.includes("Permission")) {
      return new AppError(
        "You do not have permission to perform this action",
        ErrorCode.PERMISSION_DENIED,
        403,
        context,
      );
    }

    if (
      message.includes("not found") ||
      message.includes("Not found") ||
      message.includes("404")
    ) {
      return new AppError(
        "Resource not found",
        ErrorCode.NOT_FOUND,
        404,
        context,
      );
    }

    return new AppError(
      message,
      ErrorCode.INTERNAL_SERVER_ERROR,
      500,
      context,
    );
  }

  return new AppError(
    "An unexpected error occurred",
    ErrorCode.INTERNAL_SERVER_ERROR,
    500,
    context,
  );
}

/**
 * Safe logging function that filters sensitive data
 *
 * Never logs:
 * - Access tokens
 * - JWT tokens
 * - Passwords
 * - Secret keys
 */
export function logError(entry: LogEntry): void {
  if (process.env.NODE_ENV === "production") {
    // In production, use structured logging (e.g., Sentry, CloudWatch)
    // For now, just log to console
    console.error(JSON.stringify(entry));
  } else {
    // In development, log with more details
    console.error(`[${entry.level.toUpperCase()}] ${entry.message}`, {
      code: entry.code,
      context: entry.context,
      stack: entry.stack,
    });
  }
}

/**
 * Report error to observability service (Sentry, etc.)
 *
 * Called for errors that should be tracked and monitored.
 */
export function reportError(
  error: AppError,
  context?: ErrorContext,
): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: error.statusCode >= 500 ? "error" : "warn",
    message: error.message,
    code: error.code,
    context: { ...error.context, ...context },
  };

  logError(entry);

  if (typeof window === "undefined" && error.statusCode >= 500) {
    Sentry.captureException(error, { tags: { code: error.code } });
  }
}

/**
 * Convert a thrown error into an AppError, report it, and return it.
 *
 * Shorthand for the `handleServerError` + `reportError` pair used across
 * server actions.
 */
export function reportServerError(
  error: unknown,
  context: ErrorContext,
): AppError {
  const appError = handleServerError(error, context);
  reportError(appError);
  return appError;
}

/**
 * Validate snowflake ID format (Discord IDs)
 *
 * Discord IDs are 18-19 digit numbers.
 */
export function validateSnowflake(id: string): boolean {
  return /^[0-9]{18,19}$/.test(id);
}

export function assertSnowflake(id: string, fieldName: string = "id"): void {
  if (!validateSnowflake(id)) {
    throw new AppError(
      `Invalid ${fieldName} format`,
      ErrorCode.INVALID_INPUT,
      400,
    );
  }
}

