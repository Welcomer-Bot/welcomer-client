"use client";

import {
  hasPermission,
  hasRequiredPermissions,
  Permissions,
} from "@/lib/discord/guild";
import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Tooltip } from "@heroui/react";
import { Select, SelectItem, SelectSection } from "@heroui/select";
import { DiscordMention } from "@skyra/discord-components-react";
import { APIChannel } from "discord.js";
import { useContext } from "react";
import { useStore } from "zustand";

export default function SendMenu({
  channels,
}: {
  channels: (APIChannel & {
    permissions: bigint;
  })[];
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
      color={
        hasRequiredPermissions(
          channels?.find(({ id }) => currentChannel == id)?.permissions
        )
          ? "default"
          : "warning"
      }
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
                <>
                  <SelectSection
                    key={channel.id}
                    showDivider
                    title={channel.name}
                  >
                    {children.map((c) => (
                      <SelectItem
                        key={c.id}
                        variant="flat"
                        textValue={c.name ?? c.id}
                        color={
                          hasRequiredPermissions(c.permissions)
                            ? "default"
                            : "warning"
                        }
                        endContent={
                          !hasRequiredPermissions(c.permissions) ? (
                            <Tooltip
                              content={
                                <div className="flex flex-col">
                                  <h3>
                                    Missing permissions for{" "}
                                    <DiscordMention type="channel">
                                      {c.name}
                                    </DiscordMention>
                                  </h3>
                                  <p>
                                    You need to grant Welcomer Beta the
                                    following permissions for this channel:
                                    <ul className="list-disc pl-5">
                                      {!hasPermission(
                                        c.permissions,
                                        Permissions.VIEW_CHANNEL
                                      ) && <li>View Channel</li>}
                                      {!hasPermission(
                                        c.permissions,
                                        Permissions.SEND_MESSAGES
                                      ) && <li>Send Messages</li>}
                                      {!hasPermission(
                                        c.permissions,
                                        Permissions.ATTACH_FILES
                                      ) && <li>Attach Files</li>}
                                    </ul>
                                  </p>
                                </div>
                              }
                              placement="right"
                              color="warning"
                            >
                              <span className="text-xs text-warning-600 cursor-help">
                                ⚠ Missing permissions
                              </span>
                            </Tooltip>
                          ) : (
                            <span className="text-xs text-gray-500">
                              {c.type === 5 ? "Thread" : "Channel"}
                            </span>
                          )
                        }
                      >
                        {c.name} ({c.id})
                      </SelectItem>
                    ))}
                  </SelectSection>
                </>
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
                  <SelectItem
                    key={c.id}
                    variant="flat"
                    textValue={c.name ?? c.id}
                    color={
                      hasRequiredPermissions(c.permissions)
                        ? "default"
                        : "warning"
                    }
                    endContent={
                      !hasRequiredPermissions(c.permissions) ? (
                        <Tooltip
                          content={
                            <div className="flex flex-col">
                              <h3>
                                Missing permissions for{" "}
                                <DiscordMention type="channel">
                                  {c.name}
                                </DiscordMention>
                              </h3>
                              <p>
                                You need to grant Welcomer Beta the following
                                permissions for this channel
                                <ul className="list-disc pl-5">
                                  {!hasPermission(
                                    c.permissions,
                                    Permissions.VIEW_CHANNEL
                                  ) && <li>View Channel</li>}
                                  {!hasPermission(
                                    c.permissions,
                                    Permissions.SEND_MESSAGES
                                  ) && <li>Send Messages</li>}
                                  {!hasPermission(
                                    c.permissions,
                                    Permissions.ATTACH_FILES
                                  ) && <li>Attach Files</li>}
                                </ul>
                              </p>
                            </div>
                          }
                          placement="right"
                          color="warning"
                        >
                          <span className="text-xs text-warning-600 cursor-help">
                            ⚠ Missing permissions
                          </span>
                        </Tooltip>
                      ) : (
                        <span className="text-xs text-gray-500">
                          {c.type === 5 ? "Thread" : "Channel"}
                        </span>
                      )
                    }
                  >
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
