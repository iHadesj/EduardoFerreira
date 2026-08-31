"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, type Variants } from "motion/react";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { easeOutExpo } from "@/lib/motion-presets";
import { fill } from "@/lib/i18n/format";

interface StackGroup {
  index: string;
  code: string;
  accent: string;
  label: string;
  title: string;
  description: string;
  tools: readonly string[];
  projects: string;
}

interface TechStackMotionGridProps {
  groups: readonly StackGroup[];
  /** `stack.toolsAria` — carries a `{title}` placeholder. */
  toolsAria: string;
  whereUsed: string;
}

const cardVariants: Variants = {
  hidden: {
    opacity: 1,
    y: 36,
    scale: 0.975,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.72,
      delay: (index % 3) * 0.07,
      ease: easeOutExpo,
    },
  }),
};

const codeVariants: Variants = {
  hidden: { rotate: -11, scale: 0.82 },
  visible: (index: number) => ({
    rotate: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 210,
      damping: 18,
      delay: 0.13 + (index % 3) * 0.07,
    },
  }),
};

const scanVariants: Variants = {
  hidden: { x: "-150%", opacity: 0 },
  visible: (index: number) => ({
    x: "250%",
    opacity: [0, 0.72, 0],
    transition: {
      duration: 1.05,
      delay: 0.16 + (index % 3) * 0.07,
      ease: easeOutExpo,
    },
  }),
};

export function TechStackMotionGrid({
  groups,
  toolsAria,
  whereUsed,
}: TechStackMotionGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<ReadonlySet<number>>(
    () => new Set(),
  );
  const reduced = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start 84%", "end 24%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 92,
    damping: 24,
    mass: 0.24,
    restDelta: 0.001,
  });

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || reduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entered: number[] = [];

        for (const entry of entries) {
          if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) {
            continue;
          }

          entered.push(Number(entry.target.dataset.stackIndex));
          observer.unobserve(entry.target);
        }

        if (entered.length === 0) return;

        setVisibleCards((current) => {
          const next = new Set(current);
          for (const index of entered) next.add(index);
          return next;
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5%" },
    );

    const cards = grid.querySelectorAll<HTMLElement>(".tech-stack-card");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [reduced]);

  return (
    <div ref={gridRef} className="tech-stack__grid">
      <svg
        className="tech-stack__scroll-track"
        viewBox="0 0 24 1000"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          className="tech-stack__scroll-path tech-stack__scroll-path--base"
          d="M17 0 C2 135 22 285 8 438 S22 748 7 1000"
          vectorEffect="non-scaling-stroke"
        />
        <motion.path
          className="tech-stack__scroll-path tech-stack__scroll-path--active"
          d="M17 0 C2 135 22 285 8 438 S22 748 7 1000"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: reduced ? 1 : progress }}
        />
      </svg>

      {groups.map((group, index) => (
        <motion.article
          key={group.index}
          className={`tech-stack-card tech-stack-card--${group.accent}`}
          data-stack-index={index}
          custom={index}
          variants={cardVariants}
          initial={reduced ? false : "hidden"}
          animate={reduced || visibleCards.has(index) ? "visible" : "hidden"}
          whileHover={
            reduced
              ? undefined
              : {
                  y: -5,
                  scale: 1.008,
                  transition: { duration: 0.25, ease: easeOutExpo },
                }
          }
          whileTap={reduced ? undefined : { scale: 0.985 }}
        >
          <motion.span
            className="tech-stack-card__scan"
            custom={index}
            variants={scanVariants}
            aria-hidden
          />

          <div className="tech-stack-card__header">
            <motion.span
              className="tech-stack-card__code"
              custom={index}
              variants={codeVariants}
              aria-hidden
            >
              {group.code}
            </motion.span>
            <div className="tech-stack-card__meta">
              <span>{group.index}</span>
              <span>{group.label}</span>
            </div>
          </div>

          <div className="tech-stack-card__body">
            <h3>{group.title}</h3>
            <p>{group.description}</p>
          </div>

          <ul
            className="tech-stack-card__tools"
            aria-label={fill(toolsAria, { title: group.title })}
          >
            {group.tools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>

          <p className="tech-stack-card__projects">
            <span>{whereUsed}</span>
            {group.projects}
          </p>
        </motion.article>
      ))}
    </div>
  );
}
