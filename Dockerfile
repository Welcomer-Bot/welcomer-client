# syntax=docker/dockerfile:1.7

FROM node:26-slim AS base
ENV HUSKY=0 \
    NEXT_TELEMETRY_DISABLED=1
RUN npm install -g corepack && corepack enable
WORKDIR /app

# ---- deps: install with private GH Packages auth via BuildKit secret ----
FROM base AS deps
COPY package.json yarn.lock .yarnrc.yml ./
RUN --mount=type=secret,id=gh_token \
    NODE_AUTH_TOKEN="$(cat /run/secrets/gh_token)" \
    yarn install --immutable

# ---- builder: generate Prisma client + build standalone ----
FROM base AS builder
ARG NEXT_PUBLIC_DISCORD_CLIENT_ID
ARG DIRECT_URL
ARG SESSION_SECRET
ENV NEXT_PUBLIC_DISCORD_CLIENT_ID=$NEXT_PUBLIC_DISCORD_CLIENT_ID \
    DIRECT_URL=$DIRECT_URL \
    SESSION_SECRET=$SESSION_SECRET
    COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn prisma db pull --force && yarn prisma generate && yarn build

# ---- runner: minimal standalone runtime, non-root ----
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN groupadd -g 1001 nodejs && useradd -u 1001 -g nodejs -m nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/generated ./generated

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
