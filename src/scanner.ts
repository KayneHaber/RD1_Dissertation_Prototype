/**
 * Scanner core: reads a React file, parses it into an AST,
 * and walks the tree. Detectors plug into this in stage 3.
 */

import { readFileSync } from "fs";
import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
import { Finding } from "./types";

// @babel/traverse may export the function directly or under .default,
// depending on the module version. Handle both.
const traverseModule = _traverse as unknown as
  | typeof _traverse
  | { default: typeof _traverse };
const traverse =
  typeof traverseModule === "function"
    ? traverseModule
    : traverseModule.default;

export function scanFile(filePath: string): Finding[] {
  // 1. Read the file from disk as text.
  const code: string = readFileSync(filePath, "utf-8");

  // 2. Parse the text into an AST. The plugins let Babel
  //    understand JSX and TypeScript syntax.
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  // 3. Walk the tree. For now we just count node types
  //    to prove the parsing and traversal work.
  const nodeCounts: Record<string, number> = {};
  traverse(ast, {
    enter(path) {
      const type = path.node.type;
      nodeCounts[type] = (nodeCounts[type] || 0) + 1;
    },
  });

  console.log("AST node counts:", nodeCounts);

  // No detectors yet, so no findings.
  const findings: Finding[] = [];
  return findings;
}