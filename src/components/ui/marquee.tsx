"use client";

import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

interface MarqueeProps {
  children: React.ReactNode;
  /** Seconds per full loop. */
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}

/**
 * CSS-only infinite marquee: the track is duplicated (the copy is aria-hidden)
 * and each copy translates 0→-100% with a trailing gap (pr-8) for seamlessness.
 * Reduced motion → a static wrapping grid (no animation).
 */
export function Marquee({
  children,
  speed = 40,
  reverse = false,
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  const reduced = useReducedMotionSafe();

  if (reduced) {
    return (
      <div
        className={cn("flex flex-wrap items-center gap-x-8 gap-y-3", className)}
      >
        {children}
      </div>
    );
  }

  const trackStyle: React.CSSProperties = {
    animationDuration: `${speed}s`,
    animationDirection: reverse ? "reverse" : "normal",
  };

  return (
    <div
      className={cn(
        "group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          style={trackStyle}
          className={cn(
            "animate-marquee flex shrink-0 items-center gap-8 pr-8",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
