import { describe, expect, it } from "vitest";
import {
  ancestorDirectories,
  buildFileTree,
  collectDirectoryPaths,
  filterFileTree,
  normalizePath,
  type FileTreeNode,
} from "./file-tree";

/** Compact representation of a tree for readable assertions. */
function shape(nodes: FileTreeNode[]): unknown[] {
  return nodes.map((n) => (n.kind === "file" ? n.name : { [n.name]: shape(n.children) }));
}

describe("normalizePath", () => {
  it("converts separators and strips leading, trailing and dot segments", () => {
    expect(normalizePath("./src\\lib//utils.ts")).toBe("src/lib/utils.ts");
    expect(normalizePath("/src/")).toBe("src");
  });
});

describe("buildFileTree", () => {
  it("returns an empty tree for no paths", () => {
    expect(buildFileTree([])).toEqual([]);
  });

  it("creates intermediate directories and full paths", () => {
    const tree = buildFileTree(["src/lib/utils.ts"]);
    expect(tree).toEqual([
      {
        kind: "directory",
        name: "src",
        path: "src",
        children: [
          {
            kind: "directory",
            name: "lib",
            path: "src/lib",
            children: [{ kind: "file", name: "utils.ts", path: "src/lib/utils.ts" }],
          },
        ],
      },
    ]);
  });

  it("sorts directories before files, then by natural name order", () => {
    const tree = buildFileTree(["b.ts", "file10.ts", "file2.ts", "a/x.ts", "README.md", "z/y.ts"]);
    expect(shape(tree)).toEqual([
      { a: ["x.ts"] },
      { z: ["y.ts"] },
      "b.ts",
      "file2.ts",
      "file10.ts",
      "README.md",
    ]);
  });

  it("ignores duplicates and empty paths, and normalises input", () => {
    const tree = buildFileTree(["src/a.ts", "./src/a.ts", "src\\a.ts", "", "/"]);
    expect(shape(tree)).toEqual([{ src: ["a.ts"] }]);
  });
});

describe("filterFileTree", () => {
  const tree = buildFileTree([
    "src/routes/checkout.ts",
    "src/services/order-service.ts",
    "tests/order-service.test.ts",
    "package.json",
  ]);

  it("returns the full tree for a blank query", () => {
    expect(filterFileTree(tree, "  ")).toEqual(tree);
  });

  it("keeps matching files and the directories leading to them", () => {
    expect(shape(filterFileTree(tree, "ORDER"))).toEqual([
      { src: [{ services: ["order-service.ts"] }] },
      { tests: ["order-service.test.ts"] },
    ]);
  });

  it("matches on the full path, not only the file name", () => {
    expect(shape(filterFileTree(tree, "routes/"))).toEqual([{ src: [{ routes: ["checkout.ts"] }] }]);
  });

  it("returns an empty tree when nothing matches", () => {
    expect(filterFileTree(tree, "does-not-exist")).toEqual([]);
  });
});

describe("collectDirectoryPaths", () => {
  it("lists every directory depth-first", () => {
    const tree = buildFileTree(["a/b/c.ts", "d/e.ts"]);
    expect(collectDirectoryPaths(tree)).toEqual(["a", "a/b", "d"]);
  });
});

describe("ancestorDirectories", () => {
  it("returns containing directories outermost first", () => {
    expect(ancestorDirectories("a/b/c.ts")).toEqual(["a", "a/b"]);
    expect(ancestorDirectories("root.ts")).toEqual([]);
  });
});
