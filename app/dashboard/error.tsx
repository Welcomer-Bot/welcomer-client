"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import Link from "next/link";
import { useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import * as Sentry from "@sentry/nextjs";

/**
 * Backstop for errors thrown by `[guildId]/layout.tsx` itself — e.g.
 * `getGuild`/`getUserGuild`/`getGuilds` rejecting before the Sidebar ever
 * renders. `[guildId]/error.tsx` can't catch these (a segment's error
 * boundary never wraps its own layout), so this one, a level up, is the
 * closest boundary that can. The Sidebar is part of the layout that just
 * threw, so it's unavoidably gone here too — this only guarantees we stay
 * under the root layout (theme, toasts) instead of falling all the way to
 * the unstyled `app/error.tsx`.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error, { tags: { segment: "dashboard/[guildId]" } });
    console.error(error);
  }, [error]);

  return (
    <div className="flex w-full min-h-screen items-center justify-center p-4 text-center">
      <Card className="w-full max-w-md">
        <CardBody className="items-center gap-4 py-8 text-center">
          <FiAlertTriangle aria-hidden className="text-4xl text-danger" />
          <div className="space-y-1">
            <h2 className="text-large font-semibold text-foreground">
              Something went wrong
            </h2>
            <p className="text-small text-default-500">
              We couldn&apos;t load this guild&apos;s dashboard. This is
              usually temporary — try again in a moment.
            </p>
          </div>
          {error.digest && (
            <p className="text-tiny text-default-400">
              Error ID: {error.digest}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <Button color="primary" variant="flat" onPress={() => reset()}>
              Try again
            </Button>
            <Button as={Link} href="/dashboard" variant="light">
              Back to dashboard
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
