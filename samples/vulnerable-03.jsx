// Pattern: direct DOM manipulation via innerHTML and eval
// Source: OWASP XSS Prevention Cheat Sheet (DOM-based XSS).
import React, { useRef } from "react";

export function Widget({ userInput }) {
  const ref = useRef(null);

  function render() {
    ref.current.innerHTML = userInput;
    eval(userInput);
  }

  return <div ref={ref} onClick={render} />;
}