import "@/styles/globals.css";
import clsx from "clsx";
import { Metadata, Viewport } from "next";
import { ToastContainer } from "react-toastify";
import { Providers } from "./providers";

import { fontSans } from "@/config/fonts";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
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
    <html suppressHydrationWarning lang="en">
      <head />
      <body>
        <Providers
          themeProps={{ attribute: "class", defaultTheme: "dark", children }}
        >
          <div
            className={clsx(
              "h-screen w-screen overflow-y-auto bg-background font-sans antialiased",
              fontSans.variable
            )}
          >
            {children}
          </div>
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
