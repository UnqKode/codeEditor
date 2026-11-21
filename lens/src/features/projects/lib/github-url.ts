export interface GitHubRepoRef {
  owner: string;
  repo: string;
}

// GitHub usernames: 1–39 alphanumerics or single hyphens, not starting/ending with a hyphen.
const OWNER = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
const REPO = /^[\w.-]{1,100}$/;

/**
 * Parses a GitHub repository reference. Accepts:
 *   https://github.com/owner/repo(.git)(/tree/...)
 *   github.com/owner/repo
 *   owner/repo
 * Returns null for anything that isn't a plausible public GitHub repository.
 */
export function parseGitHubRepoUrl(input: string): GitHubRepoRef | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let pathname: string;
  if (/^[\w.-]+\/[\w.-]+$/.test(trimmed)) {
    pathname = trimmed; // shorthand "owner/repo"
  } else {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    let url: URL;
    try {
      url = new URL(withProtocol);
    } catch {
      return null;
    }
    if (url.hostname !== "github.com" && url.hostname !== "www.github.com") return null;
    pathname = url.pathname;
  }

  const [owner, rawRepo] = pathname.split("/").filter(Boolean);
  if (!owner || !rawRepo) return null;

  const repo = rawRepo.replace(/\.git$/i, "");
  if (!OWNER.test(owner) || !REPO.test(repo) || repo === "." || repo === "..") return null;

  return { owner, repo };
}
