// Scenario: anchor with a normal https URL built from a constant.
// Uses href, but the value is a safe absolute URL, so no finding expected.
// Source: OWASP XSS Prevention Cheat Sheet.
import React from "react";

export function Anchor() {
  const url = "https://example.com/docs";
  return <a href={url}>Documentation</a>;
}