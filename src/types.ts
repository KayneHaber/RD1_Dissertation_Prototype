/**
 * Types for the React XSS Linter.
 */

// The category of XSS-prone pattern a detector looks for.
export type FindingType =
  | "dangerouslySetInnerHTML"
  | "dangerous-url"
  | "dom-manipulation"
  | "unsanitised-input";

// A single XSS vulnerability found in a scanned file.
export interface Finding {
  filePath: string; // which file the issue is in
  line: number; // line number of the issue
  type: FindingType; // which kind of pattern was matched
  severity: "high severity" | "medium severity" | "low severity";
  message: string; // what the problem is, in plain words
  suggestion: string; // how to fix it
}