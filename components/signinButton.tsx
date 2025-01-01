"use client";

import { Button } from "@nextui-org/button";
import { useState } from "react";

import { signIn } from "@/lib/actions";

export function SignIn({
  text = "Login with discord",
}: {
  text?: string | undefined;
}) {
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  return (
    <Button
      color="primary"
      isLoading={isRedirecting}
      type="submit"
      onPress={() => {
        setIsRedirecting(true);
        signIn();
      }}
    >
      {text}
    </Button>
  );
}
