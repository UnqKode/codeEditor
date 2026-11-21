import { describe, expect, it } from "vitest";
import { languageFromPath } from "./language";

describe("languageFromPath", () => {
  it.each([
    ["src/index.ts", "typescript"],
    ["components/App.TSX", "typescript"],
    ["scripts/build.mjs", "javascript"],
    ["package.json", "json"],
    ["docs/README.md", "markdown"],
    ["infra/Dockerfile", "dockerfile"],
  ])("%s → %s", (path, expected) => {
    expect(languageFromPath(path)).toBe(expected);
  });

  it("falls back to plaintext for unknown, missing extensions and dotfiles", () => {
    expect(languageFromPath("LICENSE")).toBe("plaintext");
    expect(languageFromPath("data.xyz")).toBe("plaintext");
    expect(languageFromPath(".env")).toBe("plaintext");
  });
});
