/**
 * Detector: direct DOM manipulation
 *
 * React updates the DOM through its virtual DOM. Bypassing this with
 * direct DOM access can introduce XSS:
 *   - assigning to innerHTML / outerHTML renders a raw HTML string
 *   - eval() executes an arbitrary string as code
 *   - document.write() injects raw markup into the page
 *
 * Source: OWASP XSS Prevention Cheat Sheet (DOM-based XSS);
 *         React documentation (refs and the DOM).
 */

import type { NodePath } from "@babel/traverse";
import type { AssignmentExpression, CallExpression } from "@babel/types";
import { Finding } from "../types";

const DANGEROUS_PROPERTIES = ["innerHTML", "outerHTML"];

// Detects: element.innerHTML = "<...>"
export function detectInnerHtmlAssignment(
  path: NodePath<AssignmentExpression>,
  filePath: string
): Finding | null {
  const left = path.node.left;
  if (left.type !== "MemberExpression") return null;

  const property = left.property;
  if (property.type !== "Identifier") return null;
  if (!DANGEROUS_PROPERTIES.includes(property.name)) return null;

  return {
    filePath,
    line: path.node.loc?.start.line ?? 0,
    type: "dom-manipulation",
    severity: "high severity",
    message:
      `Assigning to ${property.name} renders a raw HTML string and ` +
      "bypasses React's escaping.",
    suggestion:
      "Render content through JSX so React escapes it. If raw HTML is " +
      "unavoidable, sanitise it with a library such as DOMPurify first.",
  };
}

// Detects: eval(...) and document.write(...)
export function detectDangerousCall(
  path: NodePath<CallExpression>,
  filePath: string
): Finding | null {
  const callee = path.node.callee;

  let calledName: string | null = null;

  if (callee.type === "Identifier") {
    // e.g. eval(...)
    calledName = callee.name;
  } else if (
    callee.type === "MemberExpression" &&
    callee.object.type === "Identifier" &&
    callee.property.type === "Identifier"
  ) {
    // e.g. document.write(...)
    calledName = `${callee.object.name}.${callee.property.name}`;
  }

  if (calledName !== "eval" && calledName !== "document.write") {
    return null;
  }

  return {
    filePath,
    line: path.node.loc?.start.line ?? 0,
    type: "dom-manipulation",
    severity: "high severity",
    message:
      `Use of ${calledName} can execute or inject unsanitised content ` +
      "into the page.",
    suggestion:
      calledName === "eval"
        ? "Avoid eval. Parse data with JSON.parse or restructure the code."
        : "Avoid document.write. Render content through React instead.",
  };
}