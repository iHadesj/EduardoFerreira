"use client";

import { useCallback, useEffect } from "react";
import { useTheme } from "next-themes";
import { useToast } from "@/components/ui/toast";
import { useKonami } from "@/hooks/use-konami";
import { siteConfig } from "@/lib/site-config";

const TRIDENT = `
      Ψ
   ╲  │  ╱
    ╲ │ ╱
      │        H A D E S
      │
   ───┴───
`;

export function EasterEggs() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const toggleUnderworld = useCallback(() => {
    if (theme === "underworld") {
      setTheme("dark");
      toast("De volta à superfície.");
    } else {
      setTheme("underworld");
      toast("Você desceu ao submundo. (konami pra voltar)");
    }
  }, [theme, setTheme, toast]);

  useKonami(toggleUnderworld);

  // Console art for the curious recruiter (dev + prod).
  useEffect(() => {
    /* eslint-disable no-console */
    console.log(`%c${TRIDENT}`, "color:#e8a33d; font-family:monospace");
    console.log(
      `%c// procurando easter eggs? manda um oi: ${siteConfig.email}  ·  ↑↑↓↓←→←→ B A`,
      "color:#9a92a8",
    );
    /* eslint-enable no-console */
  }, []);

  // Charming tab-title swap when the user leaves the tab.
  useEffect(() => {
    const original = document.title;
    const onVisibility = () => {
      document.title = document.hidden ? "👁 o submundo aguarda…" : original;
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.title = original;
    };
  }, []);

  return null;
}
