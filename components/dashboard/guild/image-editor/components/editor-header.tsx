"use client";

import { Button } from "@heroui/button";
import Link from "next/link";
import {
  getDashboardModuleBySlug,
  getDashboardModuleBySourceType,
} from "@/features/dashboard/modules/config";
import { SourceType } from "@/generated/prisma/enums";

interface EditorHeaderProps {
  module?: string;
  guildId: string;
}

export function EditorHeader({ module, guildId }: EditorHeaderProps) {
  const moduleConfig = module
    ? getDashboardModuleBySourceType(module as SourceType) ??
      getDashboardModuleBySlug(module)
    : null;
  const backUrl = moduleConfig ? `/dashboard/${guildId}/${moduleConfig.slug}` : `/dashboard/${guildId}`;

  return (
    <div className="flex items-center gap-4">
      <Button
        as={Link}
        href={backUrl}
        variant="flat"
        size="sm"
        startContent={
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        }
      >
        Back to {module || "Dashboard"}
      </Button>
      <div className="h-6 w-px bg-default-200" />
      <h2 className="text-xl font-semibold">
        {moduleConfig ? `${moduleConfig.sourceType} Image Editor` : "Image Card Editor"}
      </h2>
    </div>
  );
}
