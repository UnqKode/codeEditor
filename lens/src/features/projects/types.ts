/**
 * Indexing lifecycle of a repository snapshot. Only "ready" means code-intelligence data exists;
 * the UI must never show analysis results for any other state.
 */
export type IndexingStatus = "not_indexed" | "queued" | "indexing" | "ready" | "failed";

export type ProjectSource =
  | { kind: "github"; owner: string; repo: string; branch: string }
  | { kind: "zip"; fileName: string }
  /** Built-in sample used for UI development. Never real analysis. */
  | { kind: "demo" };

export interface ProjectSummary {
  id: string;
  name: string;
  description: string;
  source: ProjectSource;
  /** Commit hash (or snapshot id) the file listing belongs to; null when unknown. */
  commit: string | null;
  primaryLanguage: string;
  fileCount: number;
  indexingStatus: IndexingStatus;
  updatedAt: string; // ISO-8601
}

export interface ProjectDetail extends ProjectSummary {
  /** Repository-relative file paths. Contents are loaded lazily per file. */
  filePaths: string[];
}

export interface FileContent {
  path: string;
  content: string;
}
