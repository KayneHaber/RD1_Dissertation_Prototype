/**
 * Detector: dangerous URL in href / src
 *
 * A URL beginning with the "javascript:" scheme executes code when the
 * link is followed. If such a URL reaches an href or src attribute it is
 * a Cross-Site Scripting (XSS) vector.
 *
 * Source: OWASP XSS Prevention Cheat Sheet (JavaScript URLs);
 *         React documentation.
 */

import type { NodePath } from "@babel/traverse";
import type { JSXAttribute } from "@babel/types";
import { Finding } from "../types";

const URL_ATTRIBUTES = ["href", "src"];

export function detectDangerousUrl(
  path: NodePath<JSXAttribute>,
  filePath: string
): Finding | null {
  const attributeName = path.node.name.name;

  // Only href and src attributes can carry a navigable URL.
  if (typeof attributeName !== "string") return null;
  if (!URL_ATTRIBUTES.includes(attributeName)) return null;

  // We can only inspect plain string values, e.g. href="javascript:..."
  const value = path.node.value;
  if (!value || value.type !== "StringLiteral") return null;

  const url = value.value.trim().toLowerCase();
  if (!url.startsWith("javascript:")) return null;

  return {
    filePath,
    line: path.node.loc?.start.line ?? 0,
    type: "dangerous-url",
    severity: "high severity",
    message:
      `The ${attributeName} attribute uses a "javascript:" URL, which ` +
      "executes code when the link is activated.",
    suggestion:
      "Use a standard http(s) or relative URL. Never build href or src " +
      "values from unsanitised user input.",
  };
}