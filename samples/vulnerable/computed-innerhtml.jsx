// Scenario: innerHTML accessed through a computed property key built by
// string concatenation. This is a REAL vulnerability, but the
// dom-manipulation detector only matches a direct .innerHTML identifier,
// so the computed form is missed. Expected to cause a false negative.
// Source: OWASP XSS Prevention Cheat Sheet (DOM-based XSS).
import React, { useRef } from "react";

export function Box({ userInput }) {
  const ref = useRef(null);
  function paint() {
    ref.current["inner" + "HTML"] = userInput;
  }
  return <div ref={ref} onClick={paint} />;
}