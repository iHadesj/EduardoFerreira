"use client";

import { useEffect, useRef } from "react";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/**
 * Fires `onTrigger` on the Konami code OR on typing `word` outside of inputs.
 * Pass a stable `onTrigger` (useCallback) to avoid re-binding each render.
 */
export function useKonami(onTrigger: () => void, word = "hades") {
  const konamiIndex = useRef(0);
  const buffer = useRef("");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      const inField =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        target?.isContentEditable === true;

      // Konami sequence
      const expected = KONAMI[konamiIndex.current];
      if (expected && event.key.toLowerCase() === expected.toLowerCase()) {
        konamiIndex.current += 1;
        if (konamiIndex.current === KONAMI.length) {
          konamiIndex.current = 0;
          onTrigger();
        }
      } else {
        konamiIndex.current =
          event.key.toLowerCase() === KONAMI[0]?.toLowerCase() ? 1 : 0;
      }

      // Typed word (outside form fields)
      if (!inField && /^[a-z]$/i.test(event.key)) {
        buffer.current = (buffer.current + event.key.toLowerCase()).slice(
          -word.length,
        );
        if (buffer.current === word) {
          buffer.current = "";
          onTrigger();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onTrigger, word]);
}
