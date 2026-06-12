import { cn } from "@/lib/utils";

/**
 * Static "Fragmento de Obsidiana" poster — a faceted low-poly shard with molten
 * edges over a radial glow. Always rendered (it's the LCP-safe base layer); the
 * WebGL canvas crossfades over it on capable desktops, and it stays put on
 * mobile / reduced motion. Inline SVG: crisp, themeable, ~2KB, no image request.
 */
export function HeroPoster({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("flex items-center justify-center", className)}
    >
      <svg
        viewBox="0 0 320 360"
        className="h-auto w-full max-w-[26rem]"
        role="presentation"
      >
        <defs>
          <radialGradient id="hp-glow" cx="50%" cy="46%" r="50%">
            <stop
              offset="0%"
              stopColor="var(--color-molten)"
              stopOpacity="0.35"
            />
            <stop
              offset="55%"
              stopColor="var(--color-ember)"
              stopOpacity="0.08"
            />
            <stop
              offset="100%"
              stopColor="var(--color-molten)"
              stopOpacity="0"
            />
          </radialGradient>
          <linearGradient id="hp-obsidian" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#211a2b" />
            <stop offset="100%" stopColor="#0f0b15" />
          </linearGradient>
          <linearGradient id="hp-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f2c14e" />
            <stop offset="50%" stopColor="var(--color-molten)" />
            <stop offset="100%" stopColor="#d96c2c" />
          </linearGradient>
        </defs>

        {/* Glow */}
        <circle cx="160" cy="170" r="150" fill="url(#hp-glow)" />

        {/* Faceted shard */}
        <g
          fill="url(#hp-obsidian)"
          stroke="var(--color-ash)"
          strokeWidth="1"
          strokeLinejoin="round"
        >
          <polygon points="160,28 250,120 205,210 160,150" />
          <polygon points="160,28 160,150 115,210 70,120" />
          <polygon points="70,120 115,210 150,330 100,250" />
          <polygon points="250,120 205,210 170,330 220,250" />
          <polygon points="115,210 205,210 170,330 150,330" />
          <polygon points="160,150 205,210 115,210" />
        </g>

        {/* Molten edge highlights */}
        <g
          fill="none"
          stroke="url(#hp-edge)"
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.85"
        >
          <polyline points="70,120 160,28 250,120" />
          <polyline points="160,28 160,150" opacity="0.5" />
          <polyline points="115,210 160,150 205,210" opacity="0.6" />
        </g>
        <g
          fill="none"
          stroke="var(--color-molten)"
          strokeWidth="1"
          opacity="0.25"
        >
          <polyline points="70,120 100,250 150,330" />
          <polyline points="250,120 220,250 170,330" />
        </g>
      </svg>
    </div>
  );
}
