import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

const FICHA = [
  { k: "base", v: "Brasil" }, // TODO_EDU: cidade exata
  { k: "foco", v: "Java · Spring · React · TS" },
  { k: "testes", v: "JUnit · Vitest · Playwright" },
];

export function About() {
  return (
    <section id="sobre" className="container-hades section-pad scroll-mt-24">
      <SectionHeading
        eyebrow="sobre"
        title="Do schema ao pixel, com a mesma disciplina."
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_19rem]">
        <Reveal className="prose-measure text-smoke flex flex-col gap-4">
          <p>
            Comecei pelo backend — Java, Spring, bancos relacionais — atraído
            por sistemas que precisam estar{" "}
            <span className="text-bone">certos</span>, não só bonitos: modelagem
            de dados, camadas bem desenhadas, testes que falham antes do
            usuário.
          </p>
          <p>
            Hoje estendo isso ao frontend com React e TypeScript — a mesma
            obsessão por tipos e contratos, agora na interface. Este portfolio é
            meu case study de frontend: código aberto, CI verde e performance{" "}
            <span className="text-bone">medida</span>, não prometida.
          </p>
          <p>
            Procuro um time onde engenharia importe: code review de verdade,
            decisões documentadas e espaço para levar uma feature do banco ao
            pixel.
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
    </section>
  );
}
