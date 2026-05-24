// Pattern: javascript: URL in an href attribute
// Source: OWASP XSS Prevention Cheat Sheet (JavaScript URLs).
import React from "react";

export function Link() {
  return <a href="javascript:alert(document.cookie)">Click me</a>;
}