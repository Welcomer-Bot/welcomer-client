"use client";

import { useModuleNameStore } from "@/state/moduleName";
import { ModuleName } from "@/types";
import { useEffect } from "react";

export default function ModuleInitialiser({
  moduleName,
  children,
}: {
  moduleName: ModuleName;
  children: React.ReactNode;
}) {
  const setModuleName = useModuleNameStore((state) => state.setModuleName);
  useEffect(() => {
      setModuleName(moduleName);
  }, [])

  setModuleName(moduleName);

  return <>{children}</>;
}
