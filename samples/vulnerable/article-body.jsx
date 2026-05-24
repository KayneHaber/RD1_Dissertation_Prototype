// Pattern: dangerouslySetInnerHTML with no sanitiser call
// Source: OWASP XSS Prevention Cheat Sheet.
import React from "react";

export function Article({ htmlContent }) {
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}