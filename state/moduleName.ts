import { ModuleName } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface ModuleNameParams {
  moduleName: ModuleName;
  setModuleName: (moduleName: ModuleName) => void;
}

export const useModuleNameStore = create<ModuleNameParams>()(
  immer(
    persist(
      (set, get) => ({
        moduleName: "welcomer",
        setModuleName: (moduleName) => set({ moduleName: moduleName }),
      }),
      {
        name: "module",
      }
    )
  )
);
