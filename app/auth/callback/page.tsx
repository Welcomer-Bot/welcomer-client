"use client";

/**
 * OAuth Callback Handler
 *
 * Discord redirect target. Forwards query params to handleOAuthCallback
 * server action which validates state, exchanges the token, creates the
 * session, and redirects via next/navigation.
 */

import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { use, useEffect, useRef } from "react";

import { handleOAuthCallback } from "@/lib/actions";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = use(searchParams);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const pick = (key: string) => {
      const v = params[key];
      return typeof v === "string" ? v : undefined;
    };

    handleOAuthCallback({
      code: pick("code"),
      state: pick("state"),
      error: pick("error"),
      errorDescription: pick("error_description"),
    });
  }, [params]);

  return (
    <section className="flex flex-col h-full items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <Card>
          <CardBody>
            <Button isLoading color="primary">
              Logging you in...
            </Button>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
