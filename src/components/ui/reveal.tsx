"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { easeOutExpo } from "@/lib/motion-presets";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  duration?: number;
  distance?: number;
}

/**
 * Scroll-into-view reveal: opacity 0→1 + translateY 24→0, once.
 * Under MotionConfig reducedMotion="user" the translate is dropped (fade only).
 */
export function Reveal({
  delay = 0,
  duration = 0.7,
  distance = 32,
  children,
  ...props
}: RevealProps) {
  const reduced = useReducedMotionSafe();

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: reduced ? 0 : distance,
        filter: reduced ? "none" : "blur(7px)",
      }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.16, margin: "0px 0px -7%" }}
      transition={{
        opacity: { duration: duration * 0.8, ease: easeOutExpo, delay },
        filter: { duration: duration * 0.75, ease: easeOutExpo, delay },
        y: reduced
          ? { duration: 0 }
          : {
              type: "spring",
              stiffness: 105,
              damping: 22,
              mass: 0.55,
              delay,
            },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
