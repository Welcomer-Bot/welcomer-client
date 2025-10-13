"use client";

import { getGuildsByUserId } from "@/lib/dal";
import { GuildObject } from "@/lib/discord/guild";
import { User } from "@/prisma/generated/client";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Card } from "@heroui/card";
import { useEffect, useState } from "react";
import GuildCard from "./guild-card";
export default function UserSearch({ users }: { users: User[] }) {
  const [value, setValue] = useState<React.Key | null>(null);
  const [user, setUser] = useState<User | null | undefined>(null);
  const [guilds, setGuilds] = useState<GuildObject[] | null>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const updateStats = async () => {
      if (!value) {
        setUser(null);
        return;
      }
      setLoading(true);
      const updatedUser = users.find((user) => user.id === value);
      const guilds = await getGuildsByUserId(value as string);
      setGuilds(guilds);
      setUser(updatedUser);
      setLoading(false);
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
        isLoading={loading}
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
