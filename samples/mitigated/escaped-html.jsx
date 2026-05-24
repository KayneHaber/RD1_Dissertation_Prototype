// Scenario: dangerouslySetInnerHTML fed an inline-escaped value.
// Uses the flagged API, but the value passes through an escape call.
// Source: OWASP XSS Prevention Cheat Sheet.
import React from "react";

function escapeHtml(input) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function Note({ text }) {
  return <div dangerouslySetInnerHTML={{ __html: escapeHtml(text) }} />;
}