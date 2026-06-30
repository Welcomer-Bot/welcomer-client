import { SourceType } from "@/generated/prisma/enums";

export const DASHBOARD_MODULE_SLUGS = ["welcome", "leave"] as const;

export type DashboardModuleSlug = (typeof DASHBOARD_MODULE_SLUGS)[number];

export interface DashboardModuleConfig {
  slug: DashboardModuleSlug;
  label: string;
  sourceType: SourceType;
}

const MODULES: DashboardModuleConfig[] = [
  {
    slug: "welcome",
    label: "Welcome",
    sourceType: SourceType.WELCOMER,
  },
  {
    slug: "leave",
    label: "Leaver",
    sourceType: SourceType.LEAVER,
  },
];

const MODULES_BY_SLUG: Record<DashboardModuleSlug, DashboardModuleConfig> = {
  welcome: MODULES[0],
  leave: MODULES[1],
};

const MODULES_BY_SOURCE_TYPE: Partial<Record<SourceType, DashboardModuleConfig>> = {
  [SourceType.WELCOMER]: MODULES[0],
  [SourceType.LEAVER]: MODULES[1],
};

export function getDashboardModuleBySlug(slug: string): DashboardModuleConfig | null {
  if (!DASHBOARD_MODULE_SLUGS.includes(slug as DashboardModuleSlug)) {
    return null;
  }
  return MODULES_BY_SLUG[slug as DashboardModuleSlug];
}

export function getDashboardModuleBySourceType(
  sourceType: SourceType,
): DashboardModuleConfig | null {
  return MODULES_BY_SOURCE_TYPE[sourceType] ?? null;
}

