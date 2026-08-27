"use client";

import { useEffect, useState } from "react";

/** Lightweight counterpart to the WebGL GPU gate for page-level decoration. */
export function useEconomyDevice() {
  const [economy, setEconomy] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const nav = navigator as Navigator & { deviceMemory?: number };
      const phone =
        window.matchMedia("(pointer: coarse)").matches &&
        window.innerWidth < 1024;
      const memory = nav.deviceMemory;
      const cores = navigator.hardwareConcurrency || 4;
      const dpr = window.devicePixelRatio || 1;

      setEconomy(
        phone &&
          ((memory !== undefined && memory <= 4) ||
            cores <= 4 ||
            (/Android/i.test(navigator.userAgent) &&
              dpr >= 2.5 &&
              (memory ?? 4) <= 6 &&
              cores <= 8)),
      );
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return economy;
}
