import { ModuleName } from "@/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface ModuleNameParams {
  moduleName: ModuleName | null;
  setModuleName: (moduleName: ModuleName) => void;
}

export const useModuleNameStore = create<ModuleNameParams>()(
  immer((set, get) => ({
    moduleName: null,
    setModuleName: (moduleName) => set({ moduleName: moduleName }),
  }))
);
