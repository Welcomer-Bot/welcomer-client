// client - uses useState, useRouter, and usePlausible hooks
"use client";
import { Button } from "@heroui/react";
import { usePlausible } from "next-plausible";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ManageGuildButton({ guildId }: { guildId?: string }) {
  const [loading, setLoading] = useState(false);
  const plausible = usePlausible();
  const router = useRouter();

  return (
    <Button
      color="primary"
      isLoading={loading}
      onPress={async () => {
        setLoading(true);
        plausible("dashboard-manage-guild");
        router.push(`/dashboard/${guildId}`);
      }}
    >
      Manage
    </Button>
  );
}
