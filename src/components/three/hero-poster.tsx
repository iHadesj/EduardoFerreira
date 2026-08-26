import { cn } from "@/lib/utils";

/** LCP-safe SVG counterpart to the interactive liquid-obsidian Möbius strip. */
export function HeroPoster({
  className,
  underworld = false,
}: {
  className?: string;
  underworld?: boolean;
}) {
  const accent = underworld ? "#ed2018" : "#e8a33d";
  const accentBright = underworld ? "#ff5a3d" : "#f3c66a";
  const accentDeep = underworld ? "#6f0308" : "#9f5b20";
  const reflection = underworld ? "#38070a" : "#245d66";

  return (
    <div
      aria-hidden
      className={cn("flex items-center justify-center", className)}
    >
      <svg
        viewBox="20 20 320 320"
        className="h-auto w-full"
        role="presentation"
      >
        <defs>
          <radialGradient id="hp-ambient" cx="50%" cy="48%" r="52%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.105" />
            <stop offset="50%" stopColor={reflection} stopOpacity="0.045" />
            <stop offset="100%" stopColor="#07060a" stopOpacity="0" />
          </radialGradient>
          <linearGradient
            id="hp-obsidian"
            x1="0.12"
            y1="0.08"
            x2="0.9"
            y2="0.94"
          >
            <stop offset="0%" stopColor={underworld ? "#3b080b" : "#52666c"} />
            <stop offset="18%" stopColor={underworld ? "#110306" : "#101318"} />
            <stop offset="47%" stopColor="#030306" />
            <stop offset="73%" stopColor={underworld ? "#260407" : "#152c31"} />
            <stop offset="100%" stopColor="#050407" />
          </linearGradient>
          <linearGradient id="hp-twist" x1="0.08" y1="0.18" x2="0.92" y2="0.84">
            <stop offset="0%" stopColor="#050407" />
            <stop offset="45%" stopColor={underworld ? "#1f0508" : "#1d282b"} />
            <stop offset="67%" stopColor={underworld ? "#72070b" : "#663a16"} />
            <stop offset="100%" stopColor="#09070a" />
          </linearGradient>
          <linearGradient id="hp-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accentBright} stopOpacity="0.86" />
            <stop offset="42%" stopColor={accentDeep} stopOpacity="0.3" />
            <stop offset="72%" stopColor={accent} stopOpacity="0.74" />
            <stop
              offset="100%"
              stopColor={underworld ? "#ff9a7b" : "#fff0ae"}
              stopOpacity="0.9"
            />
          </linearGradient>
          <filter id="hp-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id="hp-shadow" x="-40%" y="-100%" width="180%" height="300%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        <circle cx="180" cy="174" r="170" fill="url(#hp-ambient)" />
        <ellipse
          cx="183"
          cy="294"
          rx="86"
          ry="11"
          fill="#000"
          fillOpacity="0.5"
          filter="url(#hp-shadow)"
        />

        <path
          d="M66 183 C83 101 178 59 263 104 C330 140 321 229 248 266 C175 304 84 252 66 183 Z M106 181 C132 218 190 246 232 222 C273 198 273 158 236 137 C188 110 127 134 106 181 Z"
          fill="url(#hp-obsidian)"
          fillRule="evenodd"
          stroke="url(#hp-gold)"
          strokeWidth="1.35"
        />
        <path
          d="M96 142 C134 107 188 108 239 137 C216 154 193 180 169 207 C141 190 116 166 96 142 Z"
          fill="url(#hp-twist)"
          stroke="url(#hp-gold)"
          strokeWidth="1.1"
        />
        <path
          d="M87 137 C120 83 202 76 261 112"
          fill="none"
          stroke={underworld ? "#ff3728" : "#d9f5fa"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeOpacity="0.08"
          filter="url(#hp-glow)"
        />
        <path
          d="M98 142 C137 111 187 112 234 138"
          fill="none"
          stroke={underworld ? "#ff6045" : "#f5c96d"}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeOpacity="0.56"
        />
        <path
          d="M169 207 C188 222 211 230 232 222"
          fill="none"
          stroke={accent}
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeOpacity="0.5"
        />
      </svg>
    </div>
  );
}
