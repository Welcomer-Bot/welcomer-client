import { immer } from 'zustand/middleware/immer';
import { ModuleName } from "@/types";
import { create } from "zustand";
import { persist } from 'zustand/middleware';


export interface ModuleParams {
    moduleName: ModuleName;
    setModuleName: (moduleName: ModuleName) => void;

}

export const useModuleStore = create<ModuleParams>()(
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