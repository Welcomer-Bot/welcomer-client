"use client";
import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";
import { Select, SelectItem, SelectSection } from "@heroui/select";
import { APIChannel } from "discord.js";

export default function SendMenu({ channels }: { channels: APIChannel[] }) {
  const currentModuleName = useModuleNameStore((state) => state.moduleName);

  const store =
    currentModuleName === "welcomer" ? useWelcomerStore : useLeaverStore;
  const updateChannel = store().setChannelId;
  const currentChannel = store().channelId;

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
