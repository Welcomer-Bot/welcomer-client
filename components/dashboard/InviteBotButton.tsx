"use client";
import { Button } from "@heroui/react";
import { usePlausible } from "next-plausible";
import { useState, useEffect } from "react";
const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;

export default function InviteBotButton({ guildId }: { guildId?: string }) {
  const [loading, setLoading] = useState(false);
  const [clientId, setClientId] = useState(DISCORD_CLIENT_ID);
  const plausible = usePlausible();
  useEffect(() => {
    if (!clientId) {
      console.log("DISCORD_CLIENT_ID", DISCORD_CLIENT_ID);
      setClientId(DISCORD_CLIENT_ID);
    }
  }, [clientId]);
    

  return (
    <a
      href={`https://discord.com/api/oauth2/authorize?client_id=${clientId}
    &permissions=8&scope=bot&guild_id=${guildId}`}
    >
      <Button
        color="primary"
        isLoading={loading}
        onPress={async () => {
          setLoading(true);
          plausible("dashboard-invite-bot");
        }}
      >
        Invite Bot
      </Button>
    </a>
  );
}
