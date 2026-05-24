/**
 * Detector: unsanitised input into dangerouslySetInnerHTML
 *
 * dangerouslySetInnerHTML is only safe if the HTML string has been
 * sanitised first. This detector inspects the value passed to the prop
 * and reports it only when no recognised sanitiser call is present.
 *
 * Scope: this checks for the presence of a sanitiser call within the
 * expression. It does not perform full cross-function taint tracking,
 * which is noted as future work.
 *
 * Source: OWASP XSS Prevention Cheat Sheet; DOMPurify documentation.
 */

import type { NodePath } from "@babel/traverse";
import type { JSXAttribute, Node } from "@babel/types";
import { Finding } from "../types";

// Sanitiser calls the detector recognises as making HTML safe.
const SANITISERS = ["sanitize", "purify", "escape"];

// Recursively walk a sub-tree looking for a recognised sanitiser call.
function containsSanitiserCall(node: Node | null | undefined): boolean {
  if (!node || typeof node.type !== "string") return false;

  if (node.type === "CallExpression") {
    const callee = node.callee;
    let name: string | null = null;
    if (callee.type === "Identifier") {
      name = callee.name;
    } else if (
      callee.type === "MemberExpression" &&
      callee.property.type === "Identifier"
    ) {
      name = callee.property.name;
    }
    if (name && SANITISERS.includes(name.toLowerCase())) {
      return true;
    }
  }

  // Check every child node.
  for (const key of Object.keys(node)) {
    const child = (node as unknown as Record<string, unknown>)[key];
    if (Array.isArray(child)) {
      for (const c of child) {
        if (containsSanitiserCall(c as Node)) return true;
      }
    } else if (child && typeof (child as Node).type === "string") {
      if (containsSanitiserCall(child as Node)) return true;
    }
  }

  return false;
}

export function detectUnsanitisedInput(
  path: NodePath<JSXAttribute>,
  filePath: string
): Finding | null {
  const attributeName = path.node.name.name;
  if (attributeName !== "dangerouslySetInnerHTML") return null;

  // The value must be an expression container: ={{ __html: ... }}
  const value = path.node.value;
  if (!value || value.type !== "JSXExpressionContainer") return null;

  // If a sanitiser call is present in the expression, treat it as safe.
  if (containsSanitiserCall(value.expression)) {
    return null;
  }

  return {
    filePath,
    line: path.node.loc?.start.line ?? 0,
    type: "unsanitised-input",
    severity: "high severity",
    message:
      "dangerouslySetInnerHTML receives a value with no recognised " +
      "sanitiser call, so unsanitised input may be rendered.",
    suggestion:
      "Pass the value through a sanitiser such as DOMPurify.sanitize() " +
      "before assigning it to __html.",
  };
}