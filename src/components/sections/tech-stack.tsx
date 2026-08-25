import { SectionHeading } from "@/components/ui/section-heading";
import { Marquee } from "@/components/ui/marquee";

const BACKEND = [
  "Java",
  "Spring Boot",
  "JPA / Hibernate",
  "PostgreSQL",
  "JUnit",
  "Maven",
  "Docker",
];

const FRONTEND = [
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "React Query",
  "Vitest",
  "Git",
];

function TechItem({ label }: { label: string }) {
  return (
    <span
      data-cursor="hover"
      className="text-smoke hover:text-molten font-mono text-base whitespace-nowrap transition-colors"
    >
      {label}
    </span>
  );
}

export function TechStack() {
  return (
    <section id="stack" className="section-pad scroll-mt-24">
      <div className="container-hades">
        <SectionHeading
          eyebrow="ferramentas"
          title="O que eu tenho usado."
          description="Sem barrinha de porcentagem, porque ninguém sabe medir isso de verdade. É só a lista do que aparece nos meus projetos — back-end em cima, front-end embaixo."
        />
      </div>

      <div className="mt-10 flex flex-col gap-5">
        <Marquee speed={38}>
          {BACKEND.map((label) => (
            <TechItem key={label} label={label} />
          ))}
        </Marquee>
        <Marquee speed={46} reverse>
          {FRONTEND.map((label) => (
            <TechItem key={label} label={label} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
