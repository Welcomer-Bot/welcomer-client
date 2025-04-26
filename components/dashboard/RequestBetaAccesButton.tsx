"use client";
import { Button } from "@heroui/button";
import { usePlausible } from "next-plausible";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RequestBetaAccessButton() {
  const [loading, setLoading] = useState(false);
  const plausible = usePlausible();
  const router = useRouter();
  return (
    <Button
      color="primary"
      isLoading={loading}
      onPress={async () => {
        setLoading(true);
        plausible("dashboard-request-beta-access");
        router.push(`/support`);
      }}
    >
      Request Beta Access
    </Button>
  );
}
