"use client";
import { Button } from "@heroui/button";
import { usePlausible } from "next-plausible";
import { redirect } from "next/navigation";
import { useState } from "react";
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;

export default function InviteBotButton({ guildId }: { guildId?: string }) {
  const [loading, setLoading] = useState(false);
  const plausible = usePlausible();

  return (
    <Button
      color="primary"
      isLoading={loading}
      onPress={async () => {
        setLoading(true);
        plausible("dashboard-invite-bot");
        redirect(
          `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&permissions=8&scope=bot&guild_id=${guildId}`,
        );
      }}
    >
      Invite Bot
    </Button>
  );
}
