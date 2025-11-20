"use client";

import { SidebarContext } from "@/app/providers";
import { useContext } from "react";

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <aside
      className={`sm:h-screen h-fit z-30 sm:sticky sm:w-auto w-full bottom-0`}
    >
      <nav className="sm:h-full flex flex-row sm:flex-col bg-slate-800 border-r border-slate-700 shadow-sm sm:py-0 py-2 rounded-t-md sm:rounded-t-none">
        {children}
      </nav>
    </aside>
  );
}

export function SidebarContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useContext(SidebarContext);

  return (
    <div
      className={`overflow-hidden transition-all ${
        isOpen ? "w-20 opacity-100" : "w-0 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

export function SidebarUserSection({
  children,
  isOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
}) {
  return (
    <div
      className={`
        flex justify-between items-center
        overflow-hidden transition-all ${isOpen ? "w-48 ml-3" : "w-0"}
      `}
    >
      {children}
    </div>
  );
}
