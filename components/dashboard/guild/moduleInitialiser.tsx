"use client";

import { useImageStore } from "@/state/image";
import { useModuleNameStore } from "@/state/moduleName";
import { ModuleName } from "@/types";
import { useEffect } from "react";

export default function ModuleInitialiser({
  moduleName,
  moduleId,
  children,
}: {
    moduleName: ModuleName;
    moduleId: number;
  children: React.ReactNode;
}) {
  const setModuleName = useModuleNameStore((state) => state.setModuleName);
  const setModuleId = useImageStore((state) => state.setModuleId);
  useEffect(() => {
    setModuleName(moduleName);
    setModuleId(moduleId);
    console.log("Module Initialiser", moduleName, moduleId);
  }, [])

  setModuleName(moduleName);

  return <>{children}</>;
}
