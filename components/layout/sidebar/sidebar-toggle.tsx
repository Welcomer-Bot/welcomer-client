"use client";

import { SidebarContext } from "@/app/providers";
import { Button } from "@heroui/button";
import { useContext } from "react";

export function SidebarToggle() {
  const { isOpen, setIsOpen } = useContext(SidebarContext);

  return (
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
  );
}
