/**
 * Dashboard Guild Overview
 *
 * Landing screen for a guild:
 * - Guild identity (icon, name, beta/premium flags) and live member count
 * - One card per dashboard module, each linking to its editor
 * - Member-count trend and usage stats over a selectable range
 *
 * Auth:
 * - ✅ Middleware proxy protège /dashboard/* avec session
 * - ✅ getUserGuild() vérifie que l'user a accès à cette guild (layout)
 *
 * @see features/dashboard/modules/config.ts - Source of truth for the modules
 */

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Skeleton } from "@heroui/skeleton";
import { DiscordMention } from "@welcomer-bot/discord-components-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { ManageButton, StatsViewer } from "@/components/dashboard/guild";
import { MODULES } from "@/features/dashboard/modules/config";
import { getGuild } from "@/lib/dal/discord";
import {
  getGuildFlags,
  getLastEventAtBySource,
  getSources,
} from "@/lib/dal/sources";
import type { StatsRange } from "@/lib/utils";

/** "today" / "yesterday" / "3 days ago" — Intl does this without a date lib. */
function formatRelativeDay(date: Date) {
  const days = Math.round((date.getTime() - Date.now()) / 86_400_000);

  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    days,
    "day",
  );
}

function StatsViewerSkeleton() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>
      <Card>
        <CardBody>
          <Skeleton className="h-[180px] w-full rounded-lg" />
        </CardBody>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-0">
              <Skeleton className="h-4 w-28 rounded-lg" />
            </CardHeader>
            <CardBody>
              <Skeleton className="h-8 w-16 rounded-lg" />
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ guildId: string }>;
  searchParams: Promise<{ statsRange?: string }>;
}) {
  const { guildId } = await params;
  const search = await searchParams;

  const statsRange = (search.statsRange as StatsRange) || "7d";

  // getChannel() hangs off the guild, so this one await has to come first.
  const guild = await getGuild(guildId);
  if (!guild) redirect("/dashboard");

  const [flags, moduleStates] = await Promise.all([
    getGuildFlags(guildId),
    Promise.all(
      MODULES.map(async (module) => {
        const sources = await getSources(guildId, module.sourceType);
        const source = sources?.[0] ?? null;
        const channel = source?.channelId
          ? await guild.getChannel(source.channelId)
          : null;

        return { module, source, channel };
      }),
    ),
  ]);

  const lastEvents = await getLastEventAtBySource(
    guildId,
    moduleStates.flatMap(({ source }) => (source ? [source.id] : [])),
  );

  return (
    <div className="no-scrollbar w-full space-y-6 p-4 sm:px-6 sm:py-5">
      <header className="overflow-hidden rounded-large bg-content1">
        <div className="relative h-36 overflow-hidden sm:h-48">
          {/* `bannerUrl` already falls back to the Welcomer logo, but that
              fallback is a square SVG — Next/Image rejects SVGs anyway. Gate on
              `banner` so a real banner gets optimised, and blur the logo into a
              texture like the guild list on /dashboard does. */}
          {guild.banner ? (
            <Image
              alt=""
              className="object-cover"
              fill
              priority
              sizes="100vw"
              src={guild.bannerUrl}
            />
          ) : (
            <div
              className="h-full w-full scale-110 bg-cover bg-center opacity-70 blur-md"
              style={{ backgroundImage: `url(${guild.bannerUrl})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-content1 via-content1/50 to-transparent" />
        </div>

        <div className="relative -mt-14 flex flex-wrap items-end justify-between gap-6 px-6 pb-6 sm:-mt-16">
          <div className="flex min-w-0 items-end gap-4">
            {guild.iconUrl ? (
              <Image
                alt=""
                className="h-24 w-24 shrink-0 rounded-full ring-4 ring-content1"
                height={96}
                src={guild.iconUrl}
                width={96}
              />
            ) : (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-default-100 text-3xl ring-4 ring-content1">
                {guild.name[0]}
              </div>
            )}
            <div className="min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-3xl font-semibold">{guild.name}</h1>
                {flags.premium && (
                  <Chip color="warning" size="sm" variant="flat">
                    Premium
                  </Chip>
                )}
                {flags.beta && (
                  <Chip color="secondary" size="sm" variant="flat">
                    Beta
                  </Chip>
                )}
              </div>
              <p className="truncate text-small text-default-400">{guild.id}</p>
            </div>
          </div>

          <div className="pb-1 sm:text-right">
            <p className="text-small text-default-500">Members</p>
            <p className="text-5xl font-semibold leading-tight tabular-nums">
              {guild.memberCount?.toLocaleString() ?? "—"}
            </p>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-large font-semibold">Modules</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {moduleStates.map(({ module, source, channel }) => {
            const lastEvent = source ? lastEvents.get(source.id) : undefined;

            return (
              <Card key={module.slug} className="w-full">
                <CardHeader className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 font-medium">
                    <module.icon aria-hidden className="text-default-500" />
                    {module.label}
                  </span>
                  <Chip
                    color={source ? "success" : "default"}
                    size="sm"
                    variant="dot"
                  >
                    {source ? "Active" : "Inactive"}
                  </Chip>
                </CardHeader>
                <CardBody className="flex-row items-end justify-between gap-3 pt-0">
                  <div className="min-w-0 space-y-1 text-small text-default-500">
                    <p>
                      {channel ? (
                        <>
                          Posts to{" "}
                          <DiscordMention type="channel">
                            {channel.name}
                          </DiscordMention>
                        </>
                      ) : source ? (
                        "No channel set"
                      ) : (
                        "Not configured yet"
                      )}
                    </p>
                    <p className="text-default-400">
                      {lastEvent
                        ? `Last used ${formatRelativeDay(lastEvent)}`
                        : source
                          ? "Never used yet"
                          : " "}
                    </p>
                  </div>
                  <ManageButton
                    href={`/dashboard/${guild.id}/${module.slug}`}
                    label={source ? "Manage" : "Set up"}
                  />
                </CardBody>
              </Card>
            );
          })}
        </div>
      </section>

      <Suspense fallback={<StatsViewerSkeleton />}>
        <StatsViewer guildId={guild.id} range={statsRange} />
      </Suspense>
    </div>
  );
}
