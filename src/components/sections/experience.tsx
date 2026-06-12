import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";

interface TimelineItem {
  period: string;
  role: string;
  org?: string;
  bullets: string[];
  stack: string[];
}

// TODO_EDU: substituir por experiências/formação reais.
const TIMELINE: TimelineItem[] = [
  {
    period: "2024 — agora",
    role: "Desenvolvedor Fullstack",
    org: "TODO_EDU: empresa / freelance",
    bullets: [
      "TODO_EDU: principal entrega ou responsabilidade (com impacto/número)",
      "TODO_EDU: segunda entrega relevante",
    ],
    stack: ["Java", "Spring", "React", "TypeScript"],
  },
  {
    period: "TODO_EDU",
    role: "TODO_EDU: cargo anterior / projeto",
    org: "TODO_EDU",
    bullets: ["TODO_EDU: impacto técnico", "TODO_EDU: aprendizado ou métrica"],
    stack: ["Java", "PostgreSQL", "JUnit"],
  },
  {
    period: "TODO_EDU",
    role: "Formação",
    org: "TODO_EDU: instituição / bootcamp",
    bullets: ["TODO_EDU: foco do curso", "TODO_EDU: projeto de destaque"],
    stack: ["Estruturas de dados", "POO", "SQL"],
  },
];

export function Experience() {
  return (
    <section
      id="trajetoria"
      className="container-hades section-pad scroll-mt-24"
    >
      <SectionHeading eyebrow="trajetória" title="Trajetória" />

      <ol className="border-ash relative mt-10 flex flex-col gap-10 border-l pl-8">
        {TIMELINE.map((item, index) => (
          <li key={`${item.role}-${index}`} className="group relative">
            <span
              aria-hidden
              className="border-abyss bg-ash group-hover:bg-molten absolute top-1.5 -left-[37px] size-2.5 rounded-full border-2 transition-colors"
            />
            <Reveal delay={index * 0.08} className="flex flex-col gap-2">
              <span className="text-label text-smoke font-mono uppercase">
                {item.period}
              </span>
              <h3 className="font-display text-h3 text-bone">
                {item.role}
                {item.org ? (
                  <span className="text-smoke"> · {item.org}</span>
                ) : null}
              </h3>
              <ul className="text-smoke flex flex-col gap-1 text-sm">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span aria-hidden className="text-molten">
                      —
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 pt-1">
                {item.stack.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
