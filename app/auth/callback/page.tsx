"use client";

import { Button, Card, CardBody } from "@heroui/react";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { code, error, error_description, state } = use(searchParams);
  const router = useRouter();
  console.log("code", code);
  console.log("error", error);
  console.log("error_description", error_description);
  console.log("state", state);

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
    fetch(`/api/auth/callback?code=${code}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          return router.push(
            `/auth/error?error=${data.error}&error_description=${data.error_description}`
          );
        }
        return router.push("/dashboard");
      });
  }, [code, error, error_description, router]);

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
