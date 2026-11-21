"use client";

import Editor, { type BeforeMount } from "@monaco-editor/react";
import { languageFromPath } from "../lib/language";

const THEME = "repo3d-dark";

// Mirrors the app's dark tokens (see globals.css) so the editor blends into the workspace.
const defineTheme: BeforeMount = (monaco) => {
  monaco.editor.defineTheme(THEME, {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#0c0d10",
      "editorGutter.background": "#0c0d10",
      "editor.lineHighlightBackground": "#16181c",
      "editorLineNumber.foreground": "#4b4e56",
      "editorLineNumber.activeForeground": "#9598a0",
    },
  });
};

interface CodeViewerProps {
  path: string;
  content: string;
}

/**
 * Read-only Monaco viewer. Editing is a later milestone; keeping it read-only now makes it explicit
 * that the workspace displays repository snapshots rather than mutating them.
 */
export function CodeViewer({ path, content }: CodeViewerProps) {
  return (
    <Editor
      // `path` gives each file its own Monaco model, preserving scroll/cursor per tab.
      path={path}
      value={content}
      language={languageFromPath(path)}
      theme={THEME}
      beforeMount={defineTheme}
      loading={<p className="p-4 text-xs text-muted-foreground">Loading editor…</p>}
      options={{
        readOnly: true,
        domReadOnly: true,
        minimap: { enabled: false },
        fontSize: 13,
        fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
        lineHeight: 20,
        scrollBeyondLastLine: false,
        renderLineHighlight: "line",
        padding: { top: 8 },
        automaticLayout: true,
      }}
    />
  );
}
