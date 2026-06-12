"use client";

import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

interface SmoothLinkProps extends React.ComponentProps<"a"> {
  href: string;
}

/** Anchor that smooth-scrolls (via Lenis) for in-page #hash targets. */
export function SmoothLink({
  href,
  onClick,
  children,
  ...props
}: SmoothLinkProps) {
  const scrollTo = useSmoothScroll();
  return (
    <a
      href={href}
      onClick={(event) => {
        if (href.startsWith("#")) {
          event.preventDefault();
          scrollTo(href);
        }
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
