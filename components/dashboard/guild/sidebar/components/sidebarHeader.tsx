"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import { useContext } from "react";

import { SidebarContext } from "@/app/providers";
import { Logo } from "@/components/icons";

export function SidebarHeader() {
  const { isOpen, setIsOpen } = useContext(SidebarContext);

  return (
    <div className="p-4 pb-2 justify-between items-center align-center sm:flex hidden">
        <Link href="/dashboard">
      <div className="items-center h-10 justify-start flex flex-row">
        <Logo
          className={`overflow-hidden transition-all ${
            isOpen ? "w-10" : "w-0"
          }`}
          size={40}
        />
        <div
          className={`overflow-hidden transition-all h-full flex items-end ml-1 ${
            isOpen ? "w-20 opacity-100" : "w-0 opacity-0"
          }`}
        >
            <div className="flex flex-col leading-3 text-center">
              <h1>Welcomer</h1>
              <span className="text-small text-gray-500">Dashboard</span>
            </div>
        </div>
      </div>
          </Link>
      <Button
        isIconOnly
        className="p-1.5 rounded-lg hidden sm:grid"
        onPress={() => setIsOpen(!isOpen)}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isOpen ? (
            <path
              d="M6 18L18 6M6 6l12 12"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          ) : (
            <path
              d="M4 6h16M4 12h16m-7 6h7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          )}
        </svg>
      </Button>
    </div>
  );
}
