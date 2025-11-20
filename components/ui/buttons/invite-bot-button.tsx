"use client";
import { Button } from "@heroui/button";
import { usePlausible } from "next-plausible";
import Link from "next/link";
import { useState } from "react";

export default function InviteBotButton({ guildId }: { guildId?: string }) {
  const [loading, setLoading] = useState(false);
  const plausible = usePlausible();
  const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;

  return (
    <Link
      href={`https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands&guild_id=${guildId}`}
    >
      <Button
        color="primary"
        isLoading={loading}
        onPress={async () => {
          setLoading(true);
          plausible("dashboard-invite-bot");
        }}
      >
        Invite bot
      </Button>
    </Link>
  );
}
