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
import { ScrollSection } from "@/components/layout/scroll-flow";

const socials = [
  {
    label: "GitHub",
    href: siteConfig.links.github,
    Icon: GitHubIcon,
    external: true,
  },
  {
    label: "LinkedIn",
    href: siteConfig.links.linkedin,
    Icon: LinkedInIcon,
    external: true,
  },
  // mailto: — no new tab, no rel needed.
  {
    label: "E-mail",
    href: siteConfig.links.email,
    Icon: Mail,
    external: false,
  },
];

export function Hero() {
  return (
    <ScrollSection id="hero" className="relative" flowStrength={18}>
      <div className="container-hades grid min-h-dvh grid-cols-1 content-start items-start gap-3 pt-24 pb-12 sm:gap-8 sm:pb-20 lg:grid-cols-12 lg:content-normal lg:items-center lg:gap-6">
        <div className="flex flex-col gap-5 sm:gap-6 lg:col-span-7">
          <p className="text-molten font-mono text-[0.65rem] leading-[1.45] tracking-[0.07em] uppercase sm:text-label">
            {"// fullstack developer — java & react"}
          </p>

          <h1 className="font-display text-bone">
            <span className="block text-[length:clamp(2.35rem,11vw,2.85rem)] leading-[0.94] font-semibold tracking-[-0.025em] whitespace-nowrap sm:text-hero">
              <ScrambleText
                text="Edu Ferreira"
                className="[word-spacing:0.08em]"
              />
            </span>
            <span className="text-smoke mt-2.5 block max-w-[18ch] text-[1.3rem] leading-[1.08] sm:mt-3 sm:text-[length:clamp(1.5rem,3.5vw,2.5rem)] sm:leading-[1.1]">
              Stack <span className="text-gradient-molten">completa</span>
            </span>
          </h1>

          <p className="text-smoke max-w-[34ch] font-body text-[0.975rem] leading-[1.65] sm:max-w-[65ch] sm:text-lead">
            Backend em Java/Spring, frontend em React e TypeScript. Atualmente
            focando em arquitetura, testes e performance.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 sm:gap-4 sm:pt-2">
            <Magnetic className="inline-flex">
              <SmoothLink
                href="#projetos"
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                  "h-11 px-5 text-sm sm:h-12 sm:px-6 sm:text-base",
                )}
              >
                Ver projetos
              </SmoothLink>
            </Magnetic>
            <a
              href={siteConfig.cvUrl}
              download
              data-cursor="hover"
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "h-11 px-5 text-sm sm:h-12 sm:px-6 sm:text-base",
              )}
            >
              <Download className="size-4 sm:size-[18px]" strokeWidth={1.5} />
              Baixar CV
            </a>
          </div>

          <ul className="flex items-center gap-2.5 pt-1 sm:gap-3 sm:pt-2">
            {socials.map(({ label, href, Icon, external }) => (
              <li key={label}>
                <Magnetic className="inline-flex">
                  <a
                    href={href}
                    aria-label={label}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    data-cursor="hover"
                    className="rounded-pill border-ash text-smoke hover:border-molten hover:text-bone inline-flex size-9 items-center justify-center border transition-colors sm:size-10"
                  >
                    <Icon className="size-4 sm:size-[18px]" />
                  </a>
                </Magnetic>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-3 sm:mt-0 lg:col-span-5 lg:overflow-visible">
          <Hero3D className="mx-auto aspect-[4/3] w-[104%] max-w-md -translate-x-[8%] sm:aspect-square sm:w-full sm:translate-x-0 lg:w-[130%] lg:max-w-none lg:-translate-x-[10%]" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
        <ScrollCue />
      </div>
    </ScrollSection>
  );
}
