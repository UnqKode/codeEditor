import { describe, expect, it } from "vitest";
import { closeTab, emptyTabs, openTab, type TabsState } from "./tabs";

const tabs = (openPaths: string[], activePath: string | null): TabsState => ({ openPaths, activePath });

describe("openTab", () => {
  it("opens the first tab and activates it", () => {
    expect(openTab(emptyTabs, "a.ts")).toEqual(tabs(["a.ts"], "a.ts"));
  });

  it("inserts new tabs to the right of the active tab", () => {
    expect(openTab(tabs(["a", "b", "c"], "a"), "d")).toEqual(tabs(["a", "d", "b", "c"], "d"));
  });

  it("focuses an already-open tab without reordering", () => {
    expect(openTab(tabs(["a", "b"], "a"), "b")).toEqual(tabs(["a", "b"], "b"));
  });

  it("returns the same state object when the tab is already active", () => {
    const state = tabs(["a"], "a");
    expect(openTab(state, "a")).toBe(state);
  });
});

describe("closeTab", () => {
  it("activates the right neighbour when closing the active tab", () => {
    expect(closeTab(tabs(["a", "b", "c"], "b"), "b")).toEqual(tabs(["a", "c"], "c"));
  });

  it("falls back to the left neighbour when closing the last tab in the row", () => {
    expect(closeTab(tabs(["a", "b", "c"], "c"), "c")).toEqual(tabs(["a", "b"], "b"));
  });

  it("clears the active tab when closing the only tab", () => {
    expect(closeTab(tabs(["a"], "a"), "a")).toEqual(emptyTabs);
  });

  it("keeps the active tab when closing a different one", () => {
    expect(closeTab(tabs(["a", "b", "c"], "a"), "c")).toEqual(tabs(["a", "b"], "a"));
  });

  it("ignores unknown paths", () => {
    const state = tabs(["a"], "a");
    expect(closeTab(state, "zzz")).toBe(state);
  });
});
