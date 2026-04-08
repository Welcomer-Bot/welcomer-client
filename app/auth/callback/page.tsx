"use client";

import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { code, state, error, error_description } = use(searchParams);
  const router = useRouter();

  useEffect(() => {
    if (error) {
      if (error == "access_denied") {
        router.push("/");
        return;
      }
      router.push(
        `/auth/error?error=${error}&error_description=${error_description}`
      );
      return;
    }
    if (typeof code !== "string") {
      router.push(
        "/auth/error?error=codeMissing&error_description=The+authorization+code+is+missing",
      );
      return;
    }

    const callbackUrl = new URL("/api/auth/callback", window.location.origin);
    callbackUrl.searchParams.set("code", code);
    if (typeof state === "string") {
      callbackUrl.searchParams.set("state", state);
    }

    fetch(callbackUrl.toString())
      .then((res) => res.json())
      .then(async (data) => {
        if (data.error) {
          return router.push(
            `/auth/error?error=${data.error}&error_description=${data.error_description}`
          );
        }
        const redirectUrl = data.redirectUrl;
        if (redirectUrl) {
          return router.push(redirectUrl);
        }
        return router.push("/dashboard");
      });
  }, [code, state, error, error_description, router]);

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
