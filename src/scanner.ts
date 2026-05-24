/**
 * Scanner core: reads a React file, parses it into an AST,
 * and walks the tree. Detectors will plug into this later.
 */

import { readFileSync } from "fs";
import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
import { Finding } from "./types";

// @babel/traverse exports its function under .default in CommonJS.
const traverse = (_traverse as unknown as { default: typeof _traverse })
  .default;

export function scanFile(filePath: string): Finding[] {
  // 1. Reads the file from disk as text.
  const code: string = readFileSync(filePath, "utf-8");

  // 2. Parses the text into an AST. The plugins let Babel
  //    understand JSX and TypeScript syntax.
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  // 3. Walks the tree. For now it just counts node types
  //    to prove the parsing and traversal work.
  const nodeCounts: Record<string, number> = {};
  traverse(ast, {
    enter(path) {
      const type = path.node.type;
      nodeCounts[type] = (nodeCounts[type] || 0) + 1;
    },
  });

  console.log("AST node counts:", nodeCounts);

  // No detectors yet, so findings will be empty.
  const findings: Finding[] = [];
  return findings;
}