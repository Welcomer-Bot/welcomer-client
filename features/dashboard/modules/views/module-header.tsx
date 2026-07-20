import { Chip } from "@heroui/chip";
import { DiscordMention } from "@welcomer-bot/discord-components-react";

import {
  EnableModuleButton,
  RemoveModuleButton,
} from "@/components/dashboard/guild";
import type { DashboardModuleConfig } from "@/features/dashboard/modules/config";
import type Guild from "@/lib/discord/guild";

import { ModuleTabs } from "./module-tabs";

/**
 * Shared header for both module editors: what the module is, whether it runs,
 * where it posts, and the switch between the message and image views.
 */
export async function ModuleHeader({
  moduleConfig,
  guild,
  sourceId,
  channelId,
}: {
  moduleConfig: DashboardModuleConfig;
  guild: Guild;
  sourceId?: number;
  channelId?: string | null;
}) {
  // getChannels() is React-cached, so this costs nothing on top of the editor's
  // own lookup during the same request.
  const channel = channelId ? await guild.getChannel(channelId) : null;
  const Icon = moduleConfig.icon;

  return (
    <header className="space-y-4 border-b border-divider px-5 pt-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Icon aria-hidden className="text-default-500" />
            <h1 className="text-xl font-semibold">{moduleConfig.label}</h1>
            <Chip color={sourceId ? "success" : "default"} size="sm" variant="dot">
              {sourceId ? "Active" : "Inactive"}
            </Chip>
          </div>
          <p className="text-small text-default-500">
            {channel ? (
              <>
                Posts to{" "}
                <DiscordMention type="channel">{channel.name}</DiscordMention>
              </>
            ) : sourceId ? (
              "No channel set — pick one below"
            ) : (
              "Enable the module to start configuring it"
            )}
          </p>
        </div>

        {sourceId ? (
          <RemoveModuleButton
            guildId={guild.id}
            sourceId={sourceId}
            sourceType={moduleConfig.sourceType}
          />
        ) : (
          <EnableModuleButton
            guildId={guild.id}
            sourceType={moduleConfig.sourceType}
          />
        )}
      </div>

      {/* No editors to switch between until the module exists. */}
      {sourceId ? (
        <ModuleTabs guildId={guild.id} moduleSlug={moduleConfig.slug} />
      ) : null}
    </header>
  );
}
