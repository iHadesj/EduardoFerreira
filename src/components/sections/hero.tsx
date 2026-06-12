import { Download, Mail } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { ScrambleText } from "@/components/ui/scramble-text";
import { SmoothLink } from "@/components/ui/smooth-link";
import { Hero3D } from "@/components/three/hero-3d";
import { ScrollCue } from "@/components/sections/scroll-cue";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const socials = [
  { label: "GitHub", href: siteConfig.links.github, Icon: GitHubIcon },
  { label: "LinkedIn", href: siteConfig.links.linkedin, Icon: LinkedInIcon },
  { label: "E-mail", href: siteConfig.links.email, Icon: Mail },
];

export function Hero() {
  return (
    <section id="hero" className="relative">
      <div className="container-hades grid min-h-dvh grid-cols-1 items-center gap-10 pt-24 pb-20 lg:grid-cols-12 lg:gap-6">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <p className="text-label text-molten font-mono uppercase">
            {"// fullstack developer — java & react"}
          </p>

          <h1 className="font-display text-bone">
            <span className="text-hero block">
              <ScrambleText text="Edu Ferreira" />
            </span>
            <span className="text-smoke mt-3 block max-w-[18ch] text-[length:clamp(1.5rem,3.5vw,2.5rem)] leading-[1.1]">
              construo sistemas do{" "}
              <span className="text-gradient-molten">alicerce</span> à
              interface.
            </span>
          </h1>

          <p className="prose-measure font-body text-lead text-smoke">
            Backend em Java/Spring, frontend em React e TypeScript. Atualmente
            afiando arquitetura, testes e performance — e documentando tudo em
            case studies.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Magnetic className="inline-flex">
              <SmoothLink
                href="#projetos"
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                )}
              >
                Ver projetos
              </SmoothLink>
            </Magnetic>
            <a
              href={siteConfig.cvUrl}
              download
              data-cursor="hover"
              className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
            >
              <Download size={18} strokeWidth={1.5} /> Baixar CV
            </a>
          </div>

          <ul className="flex items-center gap-3 pt-2">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <Magnetic className="inline-flex">
                  <a
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    className="rounded-pill border-ash text-smoke hover:border-molten hover:text-bone inline-flex size-10 items-center justify-center border transition-colors"
                  >
                    <Icon className="size-[18px]" />
                  </a>
                </Magnetic>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <Hero3D className="mx-auto aspect-square w-full max-w-md lg:max-w-none" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
        <ScrollCue />
      </div>
    </section>
  );
}
