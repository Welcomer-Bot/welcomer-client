"use client";

import { SidebarContext } from "@/app/providers";
import { useContext, useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { setActive } = useContext(SidebarContext);
  useEffect(() => {
    setActive("leaver");
  }, [setActive]);
  return <>{children}</>;
}
