"use client";

import { motion } from "motion/react";

/**
 * Route-transition fade — the graceful fallback for cross-page navigation
 * (§F7). Remounts per route. Only opacity animates, so the fixed navbar keeps
 * its viewport positioning; under reduced motion it's an instant, short fade.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
