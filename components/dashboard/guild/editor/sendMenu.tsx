"use client";
import { useGuildChannelsQuery } from "@/lib/queries";
import { useGuildStore } from "@/state/guild";
import { useWelcomerStore } from "@/state/welcomer";
import { Select, SelectItem, SelectSection } from "@nextui-org/select";
import { APIChannel } from "discord-api-types/v10";

export default function SendMenu() {
  const guildId = useGuildStore((state) => state.id);
  const updateChannel = useWelcomerStore((state) => state.setChannelId);
  const currentChannel = useWelcomerStore((state) => state.channelId);
  const channels = useGuildChannelsQuery(guildId).data as
    | APIChannel[]
    | undefined;

  return (
    <Select
      label="Channel"
      placeholder="Select a channel"
      disabledKeys={["0"]}
      required
      onChange={(e) => updateChannel(e.target.value)}
      selectedKeys={[
        currentChannel && channels?.find(({ id }) => currentChannel == id)
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
