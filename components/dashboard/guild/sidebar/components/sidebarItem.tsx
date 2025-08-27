"use client";

import Link from "next/link";
import { useContext } from "react";

import { SidebarContext } from "@/app/providers";

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  link: string;
  active?: boolean;
}

export function SidebarItem({ icon, text, link, active }: SidebarItemProps) {
  const { isOpen, setIsOpen } = useContext(SidebarContext);

  return (
    <Link
      href={link}
      onClick={() => {
        setIsOpen(false);
      }}
    >
      <li
        className={`relative flex items-center justify-center py-2 px-3 my-1
          font-medium rounded-md cursor-pointer
          transition-colors group hover:text-indigo-800
          ${
            active
              ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
              : "hover:bg-indigo-50 text-white-600"
          }`}
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
          <div className="hidden sm:absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
            {text}
          </div>
        )}
      </li>
    </Link>
  );
}
