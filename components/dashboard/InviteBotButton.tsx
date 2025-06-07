"use client";
import { Button } from "@heroui/react";
import { usePlausible } from "next-plausible";
import { useState } from "react";
const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;

export default function InviteBotButton({ guildId }: { guildId?: string }) {
  const [loading, setLoading] = useState(false);
  const plausible = usePlausible();
  console.log("DISCORD_CLIENT_ID", DISCORD_CLIENT_ID);

  return (
    <a
      href={`https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}
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
