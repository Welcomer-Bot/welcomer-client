"use client";
import { HeroUIProvider } from "@heroui/react";
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";
import * as React from "react";

export function Providers({
  children,
  themeProps,
}: {
  children: React.ReactNode;
  themeProps: ThemeProviderProps;
}) {
  return (
      <HeroUIProvider>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </HeroUIProvider>
  );
}
