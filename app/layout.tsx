import "@/styles/globals.css";
import clsx from "clsx";
import { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import { Providers } from "./providers";

import { fontSans } from "@/config/fonts";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://beta.welcomer.app"),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: "/opengraph-image.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en" className="dark">
      <head />
      <body
        className={clsx(
          "bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <main className="min-h-screen w-full grid content-center">
            {/* MIGRATED: Added Suspense boundary for Cache Components */}
            {/* Routes with dynamic data (params, searchParams, cookies) now render without blocking the static shell */}
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </main>
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
