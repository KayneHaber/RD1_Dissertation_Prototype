// Pattern: safe DOM update through React state, no direct DOM access
// Source: React documentation (state and rendering).
import React, { useState } from "react";

export function Widget({ userInput }) {
  const [text, setText] = useState("");

  return <div onClick={() => setText(userInput)}>{text}</div>;
}