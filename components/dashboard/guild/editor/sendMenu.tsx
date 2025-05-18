"use client";

import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Select, SelectItem, SelectSection } from "@heroui/select";
import { RESTGetAPIGuildChannelsResult } from "discord.js";
import { useContext } from "react";
import { useStore } from "zustand";

export default function SendMenu({
  channels,
}: {
  channels: RESTGetAPIGuildChannelsResult;
}) {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const currentChannel = useStore(store, (state) => state.channelId);
  const updateChannel = useStore(store, (state) => state.setChannelId);
  // console.log(channels);
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
        <>
          {channels
            .filter((channel) => channel.type === 4)
            .map((channel) => {
              const children = channels.filter(
                (c) =>
                  (c.type === 0 || c.type === 5) && c.parent_id === channel.id
              );
              if (children.length === 0) return null;
              return (
                <SelectSection
                  key={channel.id}
                  showDivider
                  title={channel.name}
                >
                  {children.map((c) => (
                    <SelectItem key={c.id} textValue={c.name ?? c.id}>
                      {c.name} ({c.id})
                    </SelectItem>
                  ))}
                </SelectSection>
              );
            })}
          {/* Uncategorised channels */}
          {(() => {
            const uncategorized = channels.filter(
              (c) =>
                (c.type === 0 || c.type === 5) &&
                (!c.parent_id || c.parent_id === null)
            );
            if (uncategorized.length === 0) return null;
            return (
              <SelectSection
                key="uncategorized"
                showDivider
                title="Uncategorised"
              >
                {uncategorized.map((c) => (
                  <SelectItem key={c.id} textValue={c.name ?? c.id}>
                    {c.name} ({c.id})
                  </SelectItem>
                ))}
              </SelectSection>
            );
          })()}
        </>
      ) : (
        <SelectItem key={0} textValue="No channels found">
          No channels found
        </SelectItem>
      )}
    </Select>
  );
}
