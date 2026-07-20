import { SourceType } from "@/generated/prisma/enums";
import { FaDoorOpen } from "react-icons/fa";
import type { IconType } from "react-icons/lib";
import { ImEnter } from "react-icons/im";

export const DASHBOARD_MODULE_SLUGS = ["welcome", "leave"] as const;

export type DashboardModuleSlug = (typeof DASHBOARD_MODULE_SLUGS)[number];

export interface DashboardModuleConfig {
  slug: DashboardModuleSlug;
  label: string;
  sourceType: SourceType;
  icon: IconType;
}

/**
 * The dashboard's modules, in the order they appear in the sidebar and on the
 * guild overview. This is the single source of truth: both navigations derive
 * from it, so adding a module here is enough.
 */
export const MODULES: DashboardModuleConfig[] = [
  {
    slug: "welcome",
    label: "Welcomer",
    sourceType: SourceType.WELCOMER,
    icon: ImEnter,
  },
  {
    slug: "leave",
    label: "Leaver",
    sourceType: SourceType.LEAVER,
    icon: FaDoorOpen,
  },
];

const MODULES_BY_SLUG = Object.fromEntries(
  MODULES.map((m) => [m.slug, m]),
) as Record<DashboardModuleSlug, DashboardModuleConfig>;

const MODULES_BY_SOURCE_TYPE = Object.fromEntries(
  MODULES.map((m) => [m.sourceType, m]),
) as Partial<Record<SourceType, DashboardModuleConfig>>;

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
