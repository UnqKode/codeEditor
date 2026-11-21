export interface TabsState {
  /** Open file paths in display order. */
  openPaths: string[];
  activePath: string | null;
}

export const emptyTabs: TabsState = { openPaths: [], activePath: null };

/** Opens a file (or focuses it if already open). New tabs are inserted to the right of the active tab. */
export function openTab(state: TabsState, path: string): TabsState {
  if (state.openPaths.includes(path)) {
    return state.activePath === path ? state : { ...state, activePath: path };
  }
  const activeIndex = state.activePath ? state.openPaths.indexOf(state.activePath) : -1;
  const insertAt = activeIndex === -1 ? state.openPaths.length : activeIndex + 1;
  const openPaths = [...state.openPaths];
  openPaths.splice(insertAt, 0, path);
  return { openPaths, activePath: path };
}

/** Closes a tab. If it was active, focus moves to the right neighbour, else the left, else nothing. */
export function closeTab(state: TabsState, path: string): TabsState {
  const index = state.openPaths.indexOf(path);
  if (index === -1) return state;

  const openPaths = state.openPaths.filter((p) => p !== path);
  if (state.activePath !== path) return { ...state, openPaths };

  const activePath = openPaths[index] ?? openPaths[index - 1] ?? null;
  return { openPaths, activePath };
}
