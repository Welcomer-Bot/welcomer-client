import { EnableModuleButton, RemoveModuleButton, } from "@/components/dashboard/guild";
import type { DashboardModuleConfig } from "@/features/dashboard/modules/config";

import { ModuleTabs } from "./module-tabs";

/**
 * Shared header for both module editors: what the module is, whether it runs,
 * where it posts, and the switch between the message and image views.
 */
export async function ModuleHeader({
                                     moduleConfig,
                                     guildId,
                                     sourceId,

                                   }: {
  moduleConfig: DashboardModuleConfig;
  guildId: string;
  sourceId?: number;
}) {
  const Icon = moduleConfig.icon;

  return (
    <header className="border-b border-divider p-5 mb-2">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Icon aria-hidden className="text-default-500"/>
            <h1 className="text-xl font-semibold">{moduleConfig.label}</h1>
          </div>
        </div>

        {sourceId ? (
          <RemoveModuleButton
            guildId={guildId}
            sourceId={sourceId}
            sourceType={moduleConfig.sourceType}
          />
        ) : (
          <EnableModuleButton
            guildId={guildId}
            sourceType={moduleConfig.sourceType}
          />
        )}
      </div>

      {/* No editors to switch between until the module exists. */}
      {sourceId ? (
        <ModuleTabs guildId={guildId} moduleSlug={moduleConfig.slug}/>
      ) : null}
    </header>
  );
}
