// Scenario: innerHTML assigned a hardcoded constant string, not user input.
// Uses a flagged sink, but the value is static, so it is not exploitable.
// Source: OWASP XSS Prevention Cheat Sheet (DOM-based XSS).
import React, { useRef } from "react";

export function Banner() {
  const ref = useRef(null);

  function show() {
    ref.current.innerHTML = "<strong>Welcome</strong>";
  }

  return <div ref={ref} onClick={show} />;
}