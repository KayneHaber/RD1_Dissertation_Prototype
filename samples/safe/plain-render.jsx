// Scenario: article content sanitised, then rendered through plain JSX.
// No flagged API is used, so nothing should be reported.
// Source: React documentation; DOMPurify documentation.
import React from "react";
import DOMPurify from "dompurify";

export function Article({ htmlContent }) {
  const clean = DOMPurify.sanitize(htmlContent);
  return <div>{clean}</div>;
}   