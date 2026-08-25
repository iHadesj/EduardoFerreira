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

const TIMELINE: TimelineItem[] = [
  {
    // TODO_EDU: confirmar mês/ano de início do estágio na VTT.
    period: "2025 — agora",
    role: "Estagiário de Desenvolvimento Web",
    org: "VTT",
    bullets: [
      "Minha primeira experiência com projeto de verdade: prazo, gente usando e código que não é só meu — bem diferente de estudar sozinho",
      "TODO_EDU: principal entrega ou responsabilidade (com impacto/número)",
    ],
    stack: ["React", "TypeScript", "Java"],
  },
  {
    period: "fev 2025 — agora",
    role: "Bacharelado em Análise e Desenvolvimento de Sistemas",
    org: "Estácio",
    bullets: [
      "Faculdade e estágio ao mesmo tempo: o que vejo na aula costuma aparecer no trabalho na semana seguinte",
      "É onde eu pego a base que não dá pra aprender só no tutorial: estruturas de dados, banco e arquitetura",
    ],
    stack: ["Estruturas de dados", "POO", "SQL"],
  },
  {
    period: "2024 — agora",
    role: "Desenvolvedor Fullstack",
    org: "projetos próprios",
    bullets: [
      "Onde eu testo ideias sem medo de quebrar nada: React, TypeScript e Next.js em coisas como o StudyQuest e este site",
      "Banco de dados fora do slide, aprendendo na tentativa e erro: PostgreSQL e MySQL",
    ],
    stack: ["React", "TypeScript", "Next.js", "PostgreSQL"],
  },
  {
    period: "2023 — 2024",
    role: "Especialização Back-End Java",
    org: "EBAC",
    bullets: [
      "Foi aqui que o Java virou minha base: POO, JPA/Hibernate e persistência com PostgreSQL",
      "Muito CRUD em MVC com JUnit — foi o que virou o projeto API Java + PostgreSQL ali em cima",
    ],
    stack: ["Java", "JPA/Hibernate", "PostgreSQL", "JUnit"],
  },
];

export function Experience() {
  return (
    <section
      id="trajetoria"
      className="container-hades section-pad scroll-mt-24"
    >
      <SectionHeading
        eyebrow="trajetória"
        title="Como eu cheguei até aqui."
      />

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
