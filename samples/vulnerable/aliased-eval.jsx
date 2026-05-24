// Scenario: eval is copied into another variable, then called through
// that alias. This is a REAL vulnerability, but the dom-manipulation
// detector only matches a direct call named "eval", so the aliased call
// is missed. Expected to cause a false negative.
// Source: OWASP XSS Prevention Cheat Sheet (DOM-based XSS).
import React from "react";

export function Runner({ userInput }) {
  function run() {
    const exec = eval;
    exec(userInput);
  }
  return <button onClick={run}>Run</button>;
}