import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "rounded-pill text-label inline-flex items-center gap-1.5 border px-2.5 py-0.5 font-mono uppercase",
  {
    variants: {
      variant: {
        default: "border-ash text-smoke",
        molten: "border-molten/40 text-molten",
        ember: "border-ember/40 text-ember",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { badgeVariants };
