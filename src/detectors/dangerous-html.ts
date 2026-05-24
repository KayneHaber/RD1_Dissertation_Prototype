/**
 * Detector: dangerouslySetInnerHTML
 *
 * React escapes content by default. The dangerouslySetInnerHTML prop
 * bypasses that escaping and renders a raw HTML string. If the string
 * contains unsanitised user input, it is a Cross-Site Scripting (XSS)
 * vulnerability.
 *
 * Source: React documentation (dangerouslySetInnerHTML);
 *         OWASP XSS Prevention Cheat Sheet.
 */

import type { NodePath } from "@babel/traverse";
import type { JSXAttribute } from "@babel/types";
import { Finding } from "../types";

export function detectDangerousHtml(
  path: NodePath<JSXAttribute>,
  filePath: string
): Finding | null {
  const attributeName = path.node.name.name;

  // Only interested in the dangerouslySetInnerHTML JSX prop.
  if (attributeName !== "dangerouslySetInnerHTML") {
    return null;
  }

  return {
    filePath,
    line: path.node.loc?.start.line ?? 0,
    type: "dangerouslySetInnerHTML",
    severity: "high severity",
    message:
      "Use of dangerouslySetInnerHTML renders raw HTML and bypasses " +
      "React's built-in escaping.",
    suggestion:
      "Avoid dangerouslySetInnerHTML where possible. If raw HTML is " +
      "required, sanitise the value first with a library such as " +
      "DOMPurify before passing it in.",
  };
}