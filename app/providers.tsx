"use client";

import * as React from "react";
import { HeroUIProvider } from "@heroui/react";
import { useRouter } from "next/navigation";
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({
  children,
  themeProps,
}: {
  children: React.ReactNode;
  themeProps: ThemeProviderProps;
}) {
  const router = useRouter();
  const queryClient = new QueryClient();

  return (
    <>
      <HeroUIProvider navigate={router.push}>
        <QueryClientProvider client={queryClient}>
          <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
        </QueryClientProvider>
      </HeroUIProvider>
    </>
  );
}
