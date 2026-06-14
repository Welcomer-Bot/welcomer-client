"use client";

import { getUserGuildsForAdmin } from "@/lib/admin/actions";
import { GuildObject } from "@/lib/discord/guild-types";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Card } from "@heroui/card";
import { User } from "@/generated/prisma/browser";
import { useEffect, useState, useTransition } from "react";
import GuildCard from "./guild-card";
export default function UserSearch({ users }: { users: User[] }) {
  const [value, setValue] = useState<React.Key | null>(null);
  const [user, setUser] = useState<User | null | undefined>(null);
  const [guilds, setGuilds] = useState<GuildObject[] | null>([]);
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    const updateStats = () => {
      if (!value) {
        setUser(null);
        return;
      }
      const updatedUser = users.find((user) => user.id === value);
      startTransition(async () => {
        try {
          const nextGuilds = await getUserGuildsForAdmin(value as string);
          setGuilds(nextGuilds);
        } catch {
          setGuilds([]);
        }
        setUser(updatedUser);
      });
    };
    updateStats();
  }, [users, value]);

  return (
    <>
      <Autocomplete
        className="mb-4"
        label={"User ID"}
        selectedKey={value?.toString()}
        onSelectionChange={setValue}
        isLoading={isPending}
      >
        {users.map((user) => (
          <AutocompleteItem
            key={user.id}
            textValue={`${user.username} (${user.id})`}
          >
            {user.username} ({user.id})
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <Card>
        {guilds && user ? (
          guilds.map((guild) => (
            <GuildCard key={guild.id} guild={guild} userId={user.id} />
          ))
        ) : user ? (
          <p>No guilds found for this user</p>
        ) : (
          <p>No session for this user</p>
        )}
      </Card>
    </>
  );
}
