import { REST } from '@discordjs/rest';
import "server-only";

import { AppError, ErrorCode, reportError } from "@/lib/error";

// Note: this intentionally does not throw. Next.js's build-time "collecting
// page data" phase imports this module (transitively, e.g. via /admin/guilds),
// and DISCORD_BOT_TOKEN is only available at runtime, not at build time (it
// is not passed to the Docker build). Throwing here would crash `next build`
// the same way a missing SESSION_SECRET does — see Dockerfile. Instead, report
// the misconfiguration explicitly (logged + sent to Sentry) and fall back to
// an empty token, so the resulting REST client fails loudly per-request
// instead of silently, without ever taking down the build.
const RestClientSingleton = () => {
    const token = process.env.DISCORD_BOT_TOKEN;
    if (!token) {
        reportError(
            new AppError(
                "Missing required environment variable: DISCORD_BOT_TOKEN",
                ErrorCode.INTERNAL_SERVER_ERROR,
                500,
                { env: "DISCORD_BOT_TOKEN" },
            ),
            { action: "lib.discord.rest.init" },
        );
    }
    return new REST({ version: '10' }).setToken(token ?? "");
};

declare const globalThis: {
    restGlobal: ReturnType<typeof RestClientSingleton>;
} & typeof global;

const rest = globalThis.restGlobal ?? RestClientSingleton();

export default rest;

if (process.env.NODE_ENV !== "production") globalThis.restGlobal = rest;