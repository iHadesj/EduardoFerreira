import { ScrollSection } from "@/components/layout/scroll-flow";
import { TechStackMotionGrid } from "@/components/sections/tech-stack-motion";
import { SectionHeading } from "@/components/ui/section-heading";

const STACK_GROUPS = [
  {
    index: "01",
    code: "</>",
    accent: "molten",
    label: "stack principal",
    title: "Frontend & produto",
    description:
      "Interfaces tipadas, responsivas e pensadas como produto — da arquitetura ao último estado de interação.",
    tools: ["TypeScript", "React", "Next.js", "Vite", "Tailwind CSS"],
    projects: "Levva · RotaDev · Portfólio",
  },
  {
    index: "02",
    code: "API",
    accent: "styx",
    label: "servidor & realtime",
    title: "Backend & APIs",
    description:
      "APIs REST, autenticação, validação de contratos e experiências multiplayer orientadas a eventos.",
    tools: [
      "Java",
      "Spring",
      "Node.js",
      "Express",
      "Socket.IO",
      "Firebase",
      "Zod",
    ],
    projects: "StudyQuest · API Java",
  },
  {
    index: "03",
    code: "DB",
    accent: "hybrid",
    label: "estado & persistência",
    title: "Dados",
    description:
      "Estado previsível no cliente e persistência escolhida de acordo com o domínio do produto.",
    tools: [
      "Zustand",
      "TanStack Query",
      "Dexie / IndexedDB",
      "PostgreSQL",
      "JPA / Hibernate",
    ],
    projects: "Levva · StudyQuest · API Java",
  },
  {
    index: "04",
    code: "3D",
    accent: "ember",
    label: "interface avançada",
    title: "Motion & experiência",
    description:
      "Movimento, áudio e 3D usados para explicar ações e criar experiências que ficam na memória.",
    tools: [
      "Motion",
      "Three.js",
      "React Three Fiber",
      "Material UI",
      "Web Audio API",
    ],
    projects: "Portfólio · RotaDev · Change",
  },
  {
    index: "05",
    code: "QA",
    accent: "bone",
    label: "confiança & entrega",
    title: "Qualidade",
    description:
      "Testes e ferramentas de entrega aplicados onde uma regressão realmente custa confiança.",
    tools: ["Vitest", "JUnit", "ESLint", "PWA", "Vercel", "Git"],
    projects: "Levva · Java · projetos web",
  },
] as const;

export function TechStack() {
  return (
    <ScrollSection id="stack" className="tech-stack section-pad scroll-mt-24">
      <div className="container-hades">
        <div className="tech-stack__intro">
          <SectionHeading
            eyebrow="stack em prática"
            title="Ferramentas que viraram produto."
            description="Organizadas pelo problema que resolvem — e conectadas aos projetos em que foram usadas."
          />

          <a
            className="tech-stack__github-proof"
            href="https://github.com/iHadesj?tab=repositories"
            target="_blank"
            rel="noreferrer"
            aria-label="Ver os repositórios de Edu Ferreira no GitHub"
          >
            <span className="tech-stack__proof-dot" aria-hidden />
            <span>
              <strong>Stack validada no código</strong>
              <small>ver repositórios no GitHub ↗</small>
            </span>
          </a>
        </div>

        <TechStackMotionGrid groups={STACK_GROUPS} />
      </div>
    </ScrollSection>
  );
}
