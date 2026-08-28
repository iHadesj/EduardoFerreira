"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, type Variants } from "motion/react";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { easeOutExpo } from "@/lib/motion-presets";

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
}

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 44,
    scale: 0.965,
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

export function TechStackMotionGrid({ groups }: TechStackMotionGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
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

  return (
    <div ref={gridRef} className="tech-stack__grid">
      <span className="tech-stack__scroll-track" aria-hidden>
        <motion.span
          className="tech-stack__scroll-progress"
          style={{ scaleY: reduced ? 1 : progress }}
        />
      </span>

      {groups.map((group, index) => (
        <motion.article
          key={group.index}
          className={`tech-stack-card tech-stack-card--${group.accent}`}
          custom={index}
          variants={reduced ? undefined : cardVariants}
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? undefined : "visible"}
          viewport={{ once: true, amount: 0.16, margin: "0px 0px -7%" }}
        >
          <motion.span
            className="tech-stack-card__scan"
            custom={index}
            variants={reduced ? undefined : scanVariants}
            aria-hidden
          />

          <div className="tech-stack-card__header">
            <motion.span
              className="tech-stack-card__code"
              custom={index}
              variants={reduced ? undefined : codeVariants}
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
            aria-label={`Tecnologias de ${group.title}`}
          >
            {group.tools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>

          <p className="tech-stack-card__projects">
            <span>onde aparece</span>
            {group.projects}
          </p>
        </motion.article>
      ))}
    </div>
  );
}
