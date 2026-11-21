/** Monaco language identifiers for the file types we expect to display. Unknown types fall back to plaintext. */
const byExtension: Record<string, string> = {
  ts: "typescript",
  tsx: "typescript",
  mts: "typescript",
  cts: "typescript",
  js: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  json: "json",
  md: "markdown",
  css: "css",
  scss: "scss",
  html: "html",
  yml: "yaml",
  yaml: "yaml",
  py: "python",
  sh: "shell",
  sql: "sql",
};

const byFileName: Record<string, string> = {
  dockerfile: "dockerfile",
};

export function languageFromPath(path: string): string {
  const fileName = path.split("/").pop()?.toLowerCase() ?? "";
  if (byFileName[fileName]) return byFileName[fileName];

  const dot = fileName.lastIndexOf(".");
  if (dot <= 0) return "plaintext"; // no extension, or a dotfile like ".env"
  return byExtension[fileName.slice(dot + 1)] ?? "plaintext";
}
