import { cn } from "@/lib/utils";

/**
 * "Open to opportunities" status. The dot keeps a slow breathing pulse when
 * open and goes flat when closed, so the state reads before the label does —
 * the global `prefers-reduced-motion` block in globals.css stops the animation
 * without changing the colour, which is what actually carries the meaning.
 */
export function AvailabilityPill({
  open,
  label,
  ariaLabel,
  className,
}: {
  open: boolean;
  label: string;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <span
      role="status"
      aria-label={`${ariaLabel}: ${label}`}
      className={cn("availability-pill", !open && "is-closed", className)}
    >
      <span aria-hidden className="availability-pill__dot" />
      {label}
    </span>
  );
}
