"use client";

import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Select, SelectItem, SelectSection } from "@heroui/select";
import { APIChannel } from "discord.js";
import { useContext } from "react";
import { useStore } from "zustand";

export default function SendMenu({
  channels,
}: {
  channels: APIChannel[];
}) {
  const store = useContext(SourceStoreContext);
   if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const currentChannel = useStore(store, (state) => state.channelId);
  const updateChannel = useStore(store, (state) => state.setChannelId);

  return (
    <Select
      label="Channel"
      placeholder="Select a channel"
      disabledKeys={["0"]}
      required
      onChange={(e) => updateChannel(e.target.value)}
      selectedKeys={[
        currentChannel &&
        channels &&
        channels?.find(({ id }) => currentChannel == id)
          ? currentChannel
          : "",
      ]}
    >
      {channels ? (
        channels
          .filter((channel) => channel.type === 4)
          .map((channel) => (
            // if category has no channels, don't show it
            <SelectSection key={channel.id} showDivider title={channel.name}>
              {channels
                .filter((c) => c.type === 0)
                .filter((c) => c.parent_id === channel.id)
                .map((c) => (
                  <SelectItem key={c.id} textValue={c.name}>
                    {c.name} ({c.id})
                  </SelectItem>
                ))}
            </SelectSection>
          ))
      ) : (
        <SelectItem key={0} textValue="No channels found">
          No channels found
        </SelectItem>
      )}
    </Select>
  );
}
