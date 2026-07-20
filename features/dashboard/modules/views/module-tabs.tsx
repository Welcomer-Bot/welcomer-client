"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Message / Image switch for a module.
 *
 * Plain links rather than HeroUI `Tabs`: each editor keeps its own shareable
 * URL and its own server-fetched store, and navigation stays a real anchor
 * (middle-click, open in new tab) instead of controlled selection state.
 */
export function ModuleTabs({
  guildId,
  moduleSlug,
}: {
  guildId: string;
  moduleSlug: string;
}) {
  // The tabs render inside a page, not a layout, so `useSelectedLayoutSegment`
  // has no child segment to report and always returns null. Read the path.
  const pathname = usePathname();
  const base = `/dashboard/${guildId}/${moduleSlug}`;

  const tabs = [
    { key: "message", href: base, label: "Message" },
    { key: "image", href: `${base}/image`, label: "Image" },
  ];
  const active = pathname === `${base}/image` ? "image" : "message";

  return (
    <nav aria-label="Module editors" className="-mb-px flex gap-1">
      {tabs.map((tab) => {
        const isActive = tab.key === active;

        return (
          <Link
            key={tab.key}
            aria-current={isActive ? "page" : undefined}
            className={`border-b-2 px-4 py-2 text-small transition-colors ${
              isActive
                ? "border-primary font-medium text-primary"
                : "border-transparent text-default-500 hover:text-foreground"
            }`}
            href={tab.href}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
