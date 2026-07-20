"use client";

import { SidebarContext } from "@/app/providers";
import Link from "next/link";
import { useContext } from "react";

export function SidebarItem({
  icon,
  text,
  link,
  active,
}: {
  icon: React.ReactNode;
  text: string;
  link: string;
  active?: boolean;
}) {
  const { isOpen, setIsOpen } = useContext(SidebarContext);
  return (
    <Link
      aria-current={active ? "page" : undefined}
      href={link}
      onClick={() => {
        setIsOpen(false);
      }}
    >
      <li
        className={`relative flex items-center justify-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group hover:text-primary
        ${active ? "bg-gradient-to-tr from-primary-200 to-primary-100 text-primary-800" : "hover:bg-primary-50 text-foreground"}`}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all sm:block hidden ${
            isOpen ? "w-48 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>

        {!isOpen && (
          // ponytail: tooltip needs an opaque, contrasted background since it overlays
          // page content on hover - reuse the same solid (non-translucent) scale tokens
          // as the active state instead of a translucent `primary/10`.
          <div
            className={`hidden sm:absolute left-full rounded-md px-2 py-1 ml-6 bg-primary-100 text-primary-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
          >
            {text}
          </div>
        )}
      </li>
    </Link>
  );
}
