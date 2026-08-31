import { cn } from "@/lib/utils";

/** Keyboard key glyph for shortcuts (e.g. ⌘K). */
export function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "border-ash bg-ash/40 text-smoke inline-flex h-5 min-w-5 items-center justify-center rounded-sm border px-1.5 font-mono text-[0.6875rem] leading-none",
        className,
      )}
      {...props}
    />
  );
}
