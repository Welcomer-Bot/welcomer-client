"use client";
import { HeroUIProvider } from "@heroui/react";
import PlausibleProvider from "next-plausible";
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";
import * as React from "react";
import { createContext, useState } from "react";

export const SidebarContext = createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isOpen: true,
  setIsOpen: () => {},
});

export function Providers({
  children,
  themeProps,
}: {
  children: React.ReactNode;
  themeProps: ThemeProviderProps;
}) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <HeroUIProvider>
      <PlausibleProvider
        domain="beta.welcomer.app"
        customDomain="https://plausible.welcomer.app"
        selfHosted
        trackOutboundLinks
        taggedEvents
        trackLocalhost
      >
        <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
          <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
        </SidebarContext.Provider>
      </PlausibleProvider>
    </HeroUIProvider>
  );
}
