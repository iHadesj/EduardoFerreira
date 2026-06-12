"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { navItems } from "@/lib/site-config";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { fadeUpItem, staggerContainer } from "@/lib/motion-presets";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const scrollTo = useSmoothScroll();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const trigger = triggerRef.current;
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  function go(href: string) {
    setOpen(false);
    window.setTimeout(() => scrollTo(href), 60);
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label="Abrir menu"
        data-cursor="hover"
        className="rounded-pill border-ash text-smoke hover:border-molten hover:text-bone inline-flex size-9 items-center justify-center border transition-colors md:hidden"
      >
        <Menu size={18} strokeWidth={1.5} />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-abyss/98 fixed inset-0 z-[var(--z-nav)] flex flex-col backdrop-blur-md md:hidden"
          >
            <div className="container-hades flex h-16 items-center justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
                className="rounded-pill border-ash text-smoke hover:border-molten hover:text-bone inline-flex size-9 items-center justify-center border"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="container-hades flex flex-1 flex-col justify-center gap-2"
            >
              {navItems.map((item) => (
                <motion.li key={item.id} variants={fadeUpItem}>
                  <a
                    href={item.href}
                    onClick={(event) => {
                      event.preventDefault();
                      go(item.href);
                    }}
                    className="font-display text-bone hover:text-molten text-4xl transition-colors"
                  >
                    {item.label.pt}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
