import { NextRequest } from "next/server";

import { statusManager } from "@/lib/discord/status";
import { ErrorCode, handleServerError, logError, reportError } from "@/lib/error";

function jsonResponse(payload: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const headers = request.headers;

    if (!body) {
      return jsonResponse(
        {
          success: false,
          message: "No body provided",
        },
        400,
      );
    }

    if (headers.get("authorization") !== process.env.SERVER_TOKEN) {
      return jsonResponse(
        {
          success: false,
          message: "Invalid authorization token",
        },
        401,
      );
    }

    if (!body.data) {
      return jsonResponse(
        {
          success: false,
          message: "No data provided",
        },
        400,
      );
    }

    statusManager.updateStatus(body.data);

    return jsonResponse(
      {
        success: true,
        message: "Shard status updated",
      },
      200,
    );
  } catch (error) {
    const appError = handleServerError(error, {
      action: "api.status.shard.POST",
    });
    reportError(appError);
    logError({
      timestamp: new Date().toISOString(),
      level: "error",
      message: "Failed to process shard status update",
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      context: {
        action: "api.status.shard.POST",
      },
      stack: appError.stack,
    });

    return jsonResponse(
      {
        success: false,
        message: "Internal server error",
      },
      500,
    );
  }
}
