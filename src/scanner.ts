/**
 * Scanner core: reads a React file, parses it into an AST,
 * walks the tree, and runs detectors on relevant nodes.
 */

import { readFileSync } from "fs";
import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
import { Finding } from "./types";
import { detectDangerousHtml } from "./detectors/dangerous-html";

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

  // 3. Walk the tree, running detectors on the node types they apply to.
  const findings: Finding[] = [];

  traverse(ast, {
    // JSXAttribute nodes are checked by the dangerouslySetInnerHTML detector.
    JSXAttribute(path) {
      const finding = detectDangerousHtml(path, filePath);
      if (finding) {
        findings.push(finding);
      }
    },
  });

  return findings;
}