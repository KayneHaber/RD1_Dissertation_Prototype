// Scenario: value sanitised with DOMPurify on a separate line, then
// passed to dangerouslySetInnerHTML as a variable.
// This is SAFE, but the unsanitised-input detector only inspects inside
// the {{ __html: ... }} expression, so it cannot see the sanitiser call
// on the line above. Expected to cause a false positive.
// Source: DOMPurify documentation; OWASP XSS Prevention Cheat Sheet.
import React from "react";
import DOMPurify from "dompurify";

export function Article({ htmlContent }) {
  const clean = DOMPurify.sanitize(htmlContent);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}