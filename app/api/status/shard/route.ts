import {statusManager} from "@/lib/discord/status";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const headers = request.headers;
  if (!body) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "No body provided",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
//   console.log("headers", headers);
  if (headers.get("authorization") !== process.env.SERVER_TOKEN) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid authorization token",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  if (!body.data) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "No data provided",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  statusManager.updateStatus(body.data);

  return new Response(
    JSON.stringify({
      success: true,
      message: "Shard status updated",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
