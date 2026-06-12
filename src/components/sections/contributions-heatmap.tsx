import { cn } from "@/lib/utils";
import type { ContributionsData } from "@/lib/github";

const LEVEL_BG = [
  "bg-ash/40",
  "bg-molten/30",
  "bg-molten/55",
  "bg-molten/80",
  "bg-molten",
];

export function ContributionsHeatmap({ data }: { data: ContributionsData }) {
  const weeks: ContributionsData["days"][] = [];
  for (let i = 0; i < data.days.length; i += 7) {
    weeks.push(data.days.slice(i, i + 7));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-3">
        <span className="font-display text-3xl text-bone">{data.total}</span>
        <span className="text-smoke text-sm">
          contribuições no último ano
        </span>
      </div>

      <div
        role="img"
        aria-label={`${data.total} contribuições no último ano`}
        className="grid grid-flow-col grid-rows-[repeat(7,10px)] gap-[3px] overflow-x-auto pb-1"
      >
        {weeks.map((week) =>
          week.map((day) => (
            <span
              key={day.date}
              title={`${day.count} contribuições em ${day.date}`}
              className={cn(
                "size-[10px] rounded-[2px]",
                LEVEL_BG[day.level] ?? "bg-ash/40",
              )}
            />
          )),
        )}
      </div>
    </div>
  );
}
