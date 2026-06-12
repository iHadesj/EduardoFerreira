import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Eyebrow label WITHOUT the `//` prefix — the component adds it as a
   *  string expression (avoids react/jsx-no-comment-textnodes). */
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Heading level for correct document outline (default h2). */
  as?: "h2" | "h3";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <p className="text-label text-molten font-mono uppercase">
        {`// ${eyebrow}`}
      </p>
      <Heading
        className={cn(
          "font-display text-bone",
          Heading === "h2" ? "text-h2" : "text-h3",
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p className="prose-measure font-body text-lead text-smoke">
          {description}
        </p>
      ) : null}
    </div>
  );
}
