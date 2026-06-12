import type { Metadata } from "next";
import { ArrowRight, Download } from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import { Magnetic } from "@/components/ui/magnetic";
import { Marquee } from "@/components/ui/marquee";
import { Reveal } from "@/components/ui/reveal";
import { ScrambleText } from "@/components/ui/scramble-text";
import { SectionHeading } from "@/components/ui/section-heading";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const metadata: Metadata = {
  title: "Design system — /dev/ui",
  robots: { index: false, follow: false },
};

const TECH = [
  "Java",
  "Spring Boot",
  "JPA / Hibernate",
  "PostgreSQL",
  "JUnit",
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind",
];

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-ash flex flex-col gap-3 border-t py-6">
      <p className="text-label text-smoke font-mono uppercase">{label}</p>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  );
}

export default function DevUiPage() {
  return (
    <main className="container-hades section-pad">
      <header className="flex flex-wrap items-end justify-between gap-4 pb-8">
        <div className="flex flex-col gap-2">
          <p className="text-label text-molten font-mono uppercase">
            {"// dev/ui"}
          </p>
          <h1 className="font-display text-h2 text-bone">
            Submundo — design system
          </h1>
          <p className="prose-measure text-smoke">
            Banca de testes das primitivas. Use o toggle para validar o tema
            claro; emule prefers-reduced-motion no DevTools para checar o
            kill-switch de movimento.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <Row label="Button — variants × sizes">
        <Button variant="primary" size="sm">
          Ver projetos
        </Button>
        <Button variant="primary" size="md">
          Ver projetos
        </Button>
        <Button variant="primary" size="lg">
          Ver projetos
        </Button>
        <Button variant="ghost">Baixar CV</Button>
        <Button variant="link">Case study</Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
        <Button variant="ghost" asChild>
          <a href="https://github.com/iHadesj">
            <GitHubIcon className="size-[18px]" /> asChild &lt;a&gt;
          </a>
        </Button>
      </Row>

      <Row label="Badge">
        <Badge>shipped</Badge>
        <Badge variant="molten">em destaque</Badge>
        <Badge variant="ember">novo</Badge>
      </Row>

      <Row label="Card — static vs interactive">
        <Card className="w-72">
          <CardHeader>
            <h3 className="font-display text-h3 text-bone">Card estático</h3>
          </CardHeader>
          <CardBody>
            <p className="text-smoke">
              Superfície basalt, borda ash, raio lg. Sem hover.
            </p>
          </CardBody>
        </Card>
        <Card interactive className="w-72">
          <CardHeader>
            <h3 className="font-display text-h3 text-bone">Card interativo</h3>
          </CardHeader>
          <CardBody>
            <p className="text-smoke">Hover: borda molten + glow.</p>
          </CardBody>
          <CardFooter>
            <Button variant="link">
              Abrir <ArrowRight size={16} strokeWidth={1.5} />
            </Button>
          </CardFooter>
        </Card>
      </Row>

      <Row label="SectionHeading">
        <SectionHeading
          eyebrow="projetos em destaque"
          title="Engenharia que se lê como narrativa"
          description="Eyebrow mono dourado com prefixo // (renderizado como string), título Clash, descrição com medida de 65ch."
        />
      </Row>

      <Row label="Reveal (rola para dentro da viewport)">
        <Reveal className="text-bone">
          Este bloco faz fade + translateY ao entrar na viewport, uma vez.
        </Reveal>
      </Row>

      <Row label="Magnetic (apenas pointer: fine)">
        <Magnetic>
          <Button variant="primary">Me siga</Button>
        </Magnetic>
        <Magnetic className="inline-flex">
          <a
            href="https://github.com/iHadesj"
            className="rounded-pill border-ash text-smoke hover:border-molten hover:text-bone inline-flex size-11 items-center justify-center border"
            data-cursor="hover"
            aria-label="GitHub"
          >
            <GitHubIcon className="size-5" />
          </a>
        </Magnetic>
      </Row>

      <Row label="ScrambleText">
        <ScrambleText
          text="Edu Ferreira"
          className="font-display text-h2 text-bone"
        />
      </Row>

      <Row label="Kbd">
        <span className="text-smoke inline-flex items-center gap-1">
          Abrir paleta <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </Row>

      <div className="border-ash border-t py-6">
        <p className="text-label text-smoke pb-3 font-mono uppercase">
          Marquee — direções opostas, pausa no hover
        </p>
        <div className="flex flex-col gap-4">
          <Marquee speed={38}>
            {TECH.map((t) => (
              <span
                key={t}
                className="text-smoke hover:text-molten font-mono text-sm transition-colors"
              >
                {t}
              </span>
            ))}
          </Marquee>
          <Marquee speed={46} reverse>
            {TECH.map((t) => (
              <span
                key={t}
                className="text-smoke hover:text-molten font-mono text-sm transition-colors"
              >
                {t}
              </span>
            ))}
          </Marquee>
        </div>
      </div>

      <Row label="Button primário com gradiente assinatura + texto gradiente">
        <Button variant="primary" size="lg">
          <Download size={18} strokeWidth={1.5} /> Baixar CV
        </Button>
        <span className="text-gradient-molten font-display text-h3">
          ouro fundido
        </span>
      </Row>
    </main>
  );
}
