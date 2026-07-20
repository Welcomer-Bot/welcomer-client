"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import Link from "next/link";
import { useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";

/**
 * Catches errors thrown by this segment's page (and the `[module]` routes
 * nested under it) — e.g. `fetchGuildStats` rejecting via `requireGuild()`,
 * or any other DAL/render failure in `page.tsx`. Because `[guildId]/layout.tsx`
 * already rendered successfully by the time this boundary can trigger, the
 * Sidebar and Footer stay mounted and only the page content is replaced.
 *
 * Note: this boundary does NOT catch errors thrown by `[guildId]/layout.tsx`
 * itself (Next.js never lets a segment's error.tsx wrap its own layout) —
 * that case is handled one level up by `app/dashboard/error.tsx`.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="w-full h-full flex justify-center content-center items-center text-center p-4 sm:px-6 sm:py-5">
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
