"use client";

import { Button } from "@heroui/button";
import { useState } from "react";

import { signIn } from "@/lib/actions";
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
      color="primary"
      isLoading={isRedirecting}
      type="submit"
      onPress={() => {
        plausible("click-sign-in");
        setIsRedirecting(true);
        signIn();
      }}
    >
      {text}
    </Button>
  );
}
