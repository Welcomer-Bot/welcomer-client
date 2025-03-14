"use client";

import { getUserData, getGuildsByUserId } from "@/lib/dal";
import { GuildObject } from "@/lib/discord/guild";
import { UserObject } from "@/lib/discord/user";
import { Autocomplete, AutocompleteItem, Card } from "@heroui/react";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import GuildCard from "./GuildCard";
export default function UserSearch({ users }: { users: User[] }) {
  const [value, setValue] = useState<React.Key | null>(null);
  const [user, setUser] = useState<UserObject | null>(null);
  const [guilds, setGuilds] = useState<GuildObject[] | null>([]);
  useEffect(() => {
    const updateStats = async () => {
      if (!value) {
        setUser(null);
        return;
      }
      const updatedUser = await getUserData(value as string);
      const guilds = await getGuildsByUserId(value as string);
      setGuilds(guilds);
      setUser(updatedUser);
    };
    updateStats();
  }, [value]);

  return (
    <>
      <Autocomplete
        className="mb-4"
        label={"User ID"}
        selectedKey={value?.toString()}
        onSelectionChange={setValue}
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
        {guilds ? (
          guilds.map((guild) => <GuildCard key={guild.id} guild={guild} />)
        ) : user ? (
          <p>No guilds found for this user</p>
        ) : (
          <p>Search for a user to see their guilds</p>
        )}
      </Card>
    </>
  );
}
