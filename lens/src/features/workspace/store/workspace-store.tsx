"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";
import { closeTab, emptyTabs, openTab, type TabsState } from "@/features/editor/lib/tabs";
import { ancestorDirectories } from "@/features/explorer/lib/file-tree";

/** What the central area shows. Diagram/data-flow views will be added here in later phases. */
export type CenterView = "editor" | "architecture";

export interface WorkspaceState {
  tabs: TabsState;
  expandedDirs: Record<string, true>;
  centerView: CenterView;
  explorerOpen: boolean;
  assistantOpen: boolean;

  openFile: (path: string) => void;
  closeFile: (path: string) => void;
  toggleDirectory: (path: string) => void;
  setCenterView: (view: CenterView) => void;
  toggleExplorer: () => void;
  toggleAssistant: () => void;
}

function createWorkspaceStore(): StoreApi<WorkspaceState> {
  return createStore<WorkspaceState>()((set) => ({
    tabs: emptyTabs,
    expandedDirs: {},
    centerView: "editor",
    explorerOpen: true,
    assistantOpen: false,

    openFile: (path) =>
      set((s) => {
        // Reveal the file in the explorer and switch back to the editor.
        const expandedDirs = { ...s.expandedDirs };
        for (const dir of ancestorDirectories(path)) expandedDirs[dir] = true;
        return { tabs: openTab(s.tabs, path), expandedDirs, centerView: "editor" };
      }),
    closeFile: (path) => set((s) => ({ tabs: closeTab(s.tabs, path) })),
    toggleDirectory: (path) =>
      set((s) => {
        const expandedDirs = { ...s.expandedDirs };
        if (expandedDirs[path]) delete expandedDirs[path];
        else expandedDirs[path] = true;
        return { expandedDirs };
      }),
    setCenterView: (centerView) => set({ centerView }),
    toggleExplorer: () => set((s) => ({ explorerOpen: !s.explorerOpen })),
    toggleAssistant: () => set((s) => ({ assistantOpen: !s.assistantOpen })),
  }));
}

const WorkspaceStoreContext = createContext<StoreApi<WorkspaceState> | null>(null);

/**
 * One store per mounted workspace (not a module-level singleton), so state never leaks
 * between projects or between requests during server rendering.
 */
export function WorkspaceStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createWorkspaceStore);
  return <WorkspaceStoreContext.Provider value={store}>{children}</WorkspaceStoreContext.Provider>;
}

export function useWorkspace<T>(selector: (state: WorkspaceState) => T): T {
  const store = useContext(WorkspaceStoreContext);
  if (!store) throw new Error("useWorkspace must be used inside <WorkspaceStoreProvider>");
  return useStore(store, selector);
}
