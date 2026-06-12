import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";

/**
 * Display — Clash Display (Fontshare, hosted locally). Weights 500 / 600.
 * Body — Satoshi (Fontshare, hosted locally). Weights 400 / 500 / 700.
 * Mono — JetBrains Mono (Google). Weights 400 / 500.
 *
 * adjustFontFallback (default for next/font) computes fallback metrics to
 * keep CLS ~0. Subsetting to latin + latin-ext is a follow-up optimization
 * (the Fontshare web woff2 ship full charset; PT-BR accents are covered).
 */

export const clash = localFont({
  src: [
    {
      path: "../../public/fonts/ClashDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashDisplay-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-clash",
  display: "swap",
  fallback: ["system-ui", "arial"],
});

export const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
  fallback: ["system-ui", "arial"],
});

export const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const fontVariables = `${clash.variable} ${satoshi.variable} ${jetbrains.variable}`;
