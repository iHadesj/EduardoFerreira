"use client";

import Link from "next/link";
import { useViewTransitionRouter } from "@/hooks/use-view-transition-router";

type TransitionLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> & {
  /** Internal path only — external URLs belong in a plain `<a>`. */
  href: string;
};

/**
 * `next/link` that routes through a View Transition. Falls back to Link's own
 * behaviour for anything the browser should own: modified clicks, middle/right
 * button, and `target` values that open elsewhere. Prefetch, hover intent and
 * the rest of Link's machinery are untouched — only the click is intercepted.
 */
export function TransitionLink({
  href,
  onClick,
  target,
  ...props
}: TransitionLinkProps) {
  const navigate = useViewTransitionRouter();

  return (
    <Link
      href={href}
      target={target}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          (target !== undefined && target !== "_self")
        ) {
          return;
        }
        event.preventDefault();
        navigate(href);
      }}
    />
  );
}
