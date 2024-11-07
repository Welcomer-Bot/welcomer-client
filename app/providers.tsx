"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";



export function Providers({children, themeProps}: {children: React.ReactNode, themeProps: ThemeProviderProps}) {
  const router = useRouter();
  const queryClient = new QueryClient();

  return (
    <>
      <NextUIProvider navigate={router.push}>
        <QueryClientProvider client={queryClient}>
          <NextThemesProvider {...themeProps}>
            {children}
          </NextThemesProvider>
        </QueryClientProvider>
      </NextUIProvider>
    </>
  );
}
