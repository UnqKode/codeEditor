import { describe, expect, it } from "vitest";
import { parseGitHubRepoUrl } from "./github-url";

describe("parseGitHubRepoUrl", () => {
  it.each([
    "https://github.com/vercel/next.js",
    "https://github.com/vercel/next.js/",
    "https://github.com/vercel/next.js.git",
    "http://www.github.com/vercel/next.js",
    "github.com/vercel/next.js",
    "https://github.com/vercel/next.js/tree/canary/packages",
    "  vercel/next.js  ",
  ])("parses %s", (input) => {
    expect(parseGitHubRepoUrl(input)).toEqual({ owner: "vercel", repo: "next.js" });
  });

  it.each([
    "",
    "   ",
    "https://gitlab.com/owner/repo",
    "https://github.com/owner",
    "https://github.com/",
    "https://github.com.evil.com/owner/repo",
    "https://github.com/-bad/repo",
    "https://github.com/owner/..",
    "not a url",
  ])("rejects %j", (input) => {
    expect(parseGitHubRepoUrl(input)).toBeNull();
  });
});
