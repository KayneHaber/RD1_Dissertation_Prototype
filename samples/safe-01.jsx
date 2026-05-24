// Pattern: safe rendering of user input (no dangerouslySetInnerHTML)
// React escapes content placed in JSX automatically, so this is safe.
// Source: React documentation (JSX prevents injection attacks).
import React from "react";

export function Comment({ userInput }) {
  return <div>{userInput}</div>;
}