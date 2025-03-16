"use client";
import { HeroUIProvider } from "@heroui/react";
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";
import * as React from "react";
import { createContext, useState } from "react";

export const SidebarContext = createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  active: string|null;
  setActive: React.Dispatch<React.SetStateAction<string|null>>;
}>({
  isOpen: true,
  setIsOpen: () => {},
  active: null,
  setActive: () => {},
});

export function Providers({
  children,
  themeProps,
}: {
  children: React.ReactNode;
  themeProps: ThemeProviderProps;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  return (
    <HeroUIProvider>
      <SidebarContext.Provider value={{ isOpen, setIsOpen, active, setActive }}>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </SidebarContext.Provider>
    </HeroUIProvider>
  );
}
