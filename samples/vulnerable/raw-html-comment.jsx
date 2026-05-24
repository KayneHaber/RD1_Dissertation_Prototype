// Pattern: dangerouslySetInnerHTML with unsanitised data.
// Source: OWASP XSS Prevention Cheat Sheet; React docs (dangerouslySetInnerHTML).
import React from "react";

export function Comment({ userInput }) {
  return <div dangerouslySetInnerHTML={{ __html: userInput }} />;
}