"use client";

import { useEffect } from "react";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

const SIGNATURE_DURATION_MS = 3000;

/**
 * Signature reveal that draws the EF monogram, sends a luminous thread across
 * the hero and coils it into a Möbius loop. The content stays accessible.
 */
export function HeroSignature() {
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    if (reduced) {
      hero.dataset.signatureIntro = "settled";
      return;
    }

    const frame = requestAnimationFrame(() => {
      hero.dataset.signatureIntro = "running";
    });
    const timer = window.setTimeout(() => {
      hero.dataset.signatureIntro = "settled";
    }, SIGNATURE_DURATION_MS);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      hero.dataset.signatureIntro = "settled";
    };
  }, [reduced]);

  return (
    <div
      aria-hidden
      className="hero-signature-layer pointer-events-none absolute inset-0 z-[25] overflow-hidden"
    >
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        className="absolute inset-0 hidden size-full lg:block"
        role="presentation"
      >
        <defs>
          <linearGradient
            id="hero-form-gradient-desktop"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop offset="0" stopColor="var(--color-molten)" stopOpacity="0" />
            <stop
              offset="0.44"
              stopColor="var(--color-molten)"
              stopOpacity="0.95"
            />
            <stop offset="0.72" stopColor="var(--color-bone)" />
            <stop
              offset="1"
              stopColor="var(--color-molten)"
              stopOpacity="0.28"
            />
          </linearGradient>
          <filter
            id="hero-form-glow-desktop"
            x="-35%"
            y="-80%"
            width="170%"
            height="260%"
          >
            <feGaussianBlur stdDeviation="3.2" />
          </filter>
        </defs>

        <g className="hero-intro-drawing">
          <path
            pathLength="1"
            d="M 314 318 H 270 V 252 H 322 M 270 284 H 310 M 342 318 V 252 H 394 M 342 284 H 382"
            fill="none"
            stroke="var(--color-molten)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        <g className="hero-form-thread-group">
          <path
            pathLength="1"
            className="hero-form-thread hero-form-thread-glow"
            d="M 394 284 C 518 244 646 250 730 306 C 774 336 790 378 816 416"
            fill="none"
            stroke="url(#hero-form-gradient-desktop)"
            strokeWidth="8"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            filter="url(#hero-form-glow-desktop)"
            opacity={0}
          />
          <path
            pathLength="1"
            className="hero-form-thread"
            d="M 394 284 C 518 244 646 250 730 306 C 774 336 790 378 816 416"
            fill="none"
            stroke="url(#hero-form-gradient-desktop)"
            strokeWidth="1.45"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity={0}
          />
        </g>

        <g className="hero-form-loop-group">
          <path
            pathLength="1"
            className="hero-form-loop hero-form-loop-glow"
            d="M 816 416 C 850 312 1056 288 1090 410 C 1120 520 956 570 850 500 C 770 446 822 350 912 370 C 1010 390 1008 500 1082 470"
            fill="none"
            stroke="url(#hero-form-gradient-desktop)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            filter="url(#hero-form-glow-desktop)"
            opacity={0}
          />
          <path
            pathLength="1"
            className="hero-form-loop"
            d="M 816 416 C 850 312 1056 288 1090 410 C 1120 520 956 570 850 500 C 770 446 822 350 912 370 C 1010 390 1008 500 1082 470"
            fill="none"
            stroke="url(#hero-form-gradient-desktop)"
            strokeWidth="1.55"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            opacity={0}
          />
        </g>
      </svg>

      <svg
        viewBox="0 0 390 760"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full lg:hidden"
        role="presentation"
      >
        <defs>
          <linearGradient
            id="hero-form-gradient-mobile"
            x1="0"
            y1="0"
            x2="0.7"
            y2="1"
          >
            <stop offset="0" stopColor="var(--color-molten)" stopOpacity="0" />
            <stop
              offset="0.42"
              stopColor="var(--color-molten)"
              stopOpacity="0.95"
            />
            <stop offset="0.72" stopColor="var(--color-bone)" />
            <stop
              offset="1"
              stopColor="var(--color-molten)"
              stopOpacity="0.3"
            />
          </linearGradient>
          <filter
            id="hero-form-glow-mobile"
            x="-70%"
            y="-35%"
            width="240%"
            height="170%"
          >
            <feGaussianBlur stdDeviation="2.6" />
          </filter>
        </defs>

        <g className="hero-intro-drawing">
          <path
            pathLength="1"
            d="M 190 88 H 168 V 62 H 194 M 168 75 H 188 M 204 88 V 62 H 230 M 204 75 H 226"
            fill="none"
            stroke="var(--color-molten)"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        <g className="hero-form-thread-group">
          <path
            pathLength="1"
            className="hero-form-thread hero-form-thread-glow"
            d="M 230 75 C 320 82 352 142 344 230 C 338 314 290 390 238 505"
            fill="none"
            stroke="url(#hero-form-gradient-mobile)"
            strokeWidth="7"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            filter="url(#hero-form-glow-mobile)"
            opacity={0}
          />
          <path
            pathLength="1"
            className="hero-form-thread"
            d="M 230 75 C 320 82 352 142 344 230 C 338 314 290 390 238 505"
            fill="none"
            stroke="url(#hero-form-gradient-mobile)"
            strokeWidth="1.3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity={0}
          />
        </g>

        <g className="hero-form-loop-group">
          <path
            pathLength="1"
            className="hero-form-loop hero-form-loop-glow"
            d="M 238 505 C 318 520 344 620 282 690 C 218 760 76 726 64 636 C 52 544 160 498 236 548 C 312 598 280 708 190 706 C 108 704 68 632 108 574 C 146 520 214 532 260 584"
            fill="none"
            stroke="url(#hero-form-gradient-mobile)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            filter="url(#hero-form-glow-mobile)"
            opacity={0}
          />
          <path
            pathLength="1"
            className="hero-form-loop"
            d="M 238 505 C 318 520 344 620 282 690 C 218 760 76 726 64 636 C 52 544 160 498 236 548 C 312 598 280 708 190 706 C 108 704 68 632 108 574 C 146 520 214 532 260 584"
            fill="none"
            stroke="url(#hero-form-gradient-mobile)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            opacity={0}
          />
        </g>
      </svg>
    </div>
  );
}
