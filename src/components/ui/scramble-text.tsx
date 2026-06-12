"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

const CHARS = "#$%&@HADES01";

interface ScrambleTextProps {
  text: string;
  className?: string;
  durationMs?: number;
}

/**
 * Decode effect: random glyphs resolve into `text` over ~durationMs, once on
 * mount. SSR/first render shows the final text (no hydration mismatch); the
 * accessible name stays correct via aria-label. Reduced motion → direct text.
 */
export function ScrambleText({
  text,
  className,
  durationMs = 900,
}: ScrambleTextProps) {
  const reduced = useReducedMotionSafe();
  const [display, setDisplay] = useState(text);
  const started = useRef(false);

  useEffect(() => {
    if (reduced || started.current) return;
    started.current = true;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const revealCount = Math.floor(progress * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i] ?? "";
        if (i < revealCount || ch === " ") {
          out += ch;
        } else {
          out += CHARS[Math.floor(Math.random() * CHARS.length)] ?? "0";
        }
      }
      setDisplay(out);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, durationMs, reduced]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{display}</span>
    </span>
  );
}
