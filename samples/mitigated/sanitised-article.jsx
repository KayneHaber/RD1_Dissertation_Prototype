// Pattern: dangerouslySetInnerHTML with the value sanitised inline
// Source: DOMPurify documentation; OWASP XSS Prevention Cheat Sheet.
import React from "react";
import DOMPurify from "dompurify";

export function Article({ htmlContent }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} />
  );
}