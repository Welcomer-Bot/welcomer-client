"use client";

import { Button } from "@heroui/button";
import { useState } from "react";

import { usePlausible } from "next-plausible";

export function SignIn({
  text = "Login with discord",
}: {
  text?: string | undefined;
}) {
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  const plausible = usePlausible();
  return (
    <Button
      as="a"
      href="/api/auth/login"
      color="primary"
      isLoading={isRedirecting}
      onPress={() => {
        plausible("click-sign-in");
        setIsRedirecting(true);
      }}
    >
      {text}
    </Button>
  );
}
