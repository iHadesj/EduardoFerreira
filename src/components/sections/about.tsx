import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ScrollSection } from "@/components/layout/scroll-flow";

const FICHA = [
  { k: "onde", v: "SP-ZS" }, // TODO_EDU: cidade exata
  { k: "no dia a dia", v: "Java · Spring · React · TS" },
  { k: "aprendendo", v: "JUnit · Vitest · Playwright" },
];

export function About() {
  return (
    <ScrollSection
      id="sobre"
      className="container-hades section-pad scroll-mt-24"
    >
      <SectionHeading
        eyebrow="sobre"
        title="Interessado desde o primeiro CRUD."
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_19rem]">
        <Reveal className="prose-measure text-smoke flex flex-col gap-4">
          <p>
            Comecei pelo back-end — Java, Spring, banco de dados — porque queria
            entender o que acontece{" "}
            <span className="text-bone">atrás da tela</span>. Modelar os dados,
            separar as camadas, escrever um teste e ver ele pegar o erro antes
            de mim: foi aí que caiu a ficha.
          </p>
          <p>
            Depois fui pro front com React e TypeScript e descobri que gosto dos
            dois stacks. Este site é minha área de{" "}
            <span className="text-bone">experimentos</span> — está tudo no
            GitHub, com o que foi concluído e o que eu ainda quero melhorar.
          </p>
          <p>
            {/* TODO_EDU: ajustar ao objetivo atual */}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="border-ash bg-basalt rounded-lg border p-6 font-mono text-sm">
            {FICHA.map((row) => (
              <div
                key={row.k}
                className="border-ash/60 flex items-baseline justify-between gap-4 border-b py-2.5"
              >
                <dt className="text-smoke">{row.k}</dt>
                <dd className="text-bone text-right">{row.v}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 pt-3">
              <dt className="text-smoke">status</dt>
              <dd className="text-bone inline-flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="bg-molten absolute inline-flex size-full animate-ping rounded-full opacity-60" />
                  <span className="bg-molten relative inline-flex size-2 rounded-full" />
                </span>
                aberto a oportunidades
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </ScrollSection>
  );
}
