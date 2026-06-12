"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { easeOutExpo } from "@/lib/motion-presets";

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  duration?: number;
}

/**
 * Scroll-into-view reveal: opacity 0→1 + translateY 24→0, once.
 * Under MotionConfig reducedMotion="user" the translate is dropped (fade only).
 */
export function Reveal({
  delay = 0,
  duration = 0.6,
  children,
  ...props
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration, ease: easeOutExpo, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
