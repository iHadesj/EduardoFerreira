import Link from "next/link";
import { Mail } from "lucide-react";
import { navItems, siteConfig } from "@/lib/site-config";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { Magnetic } from "@/components/ui/magnetic";

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

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-ash border-t">
      <div className="container-hades grid gap-10 py-14 md:grid-cols-3">
        <div className="flex flex-col gap-3">
          <span className="font-display text-bone text-2xl">EF</span>
          <p className="prose-measure text-smoke text-sm">
            Dev fullstack: Java no back, React e TypeScript no front. Aprendendo
            um pouco mais todo dia.
          </p>
        </div>

        <nav aria-label="Rodapé" className="flex flex-col gap-2">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              data-cursor="hover"
              className="text-smoke hover:text-molten w-fit text-sm transition-colors"
            >
              {item.label.pt}
            </a>
          ))}
        </nav>

        <div className="flex items-start gap-3">
          {socials.map(({ label, href, Icon, external }) => (
            <Magnetic key={label} className="inline-flex">
              <a
                href={href}
                aria-label={label}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                data-cursor="hover"
                className="rounded-pill border-ash text-smoke hover:border-molten hover:text-bone inline-flex size-10 items-center justify-center border transition-colors"
              >
                <Icon className="size-[18px]" />
              </a>
            </Magnetic>
          ))}
        </div>
      </div>

      <div className="container-hades border-ash text-smoke flex flex-col gap-2 border-t py-6 font-mono text-xs sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} Edu Ferreira — feito com Next.js, teimosia e muito café.
        </p>
        <Link
          href={siteConfig.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="hover"
          className="hover:text-molten w-fit transition-colors"
        >
          ver código-fonte ↗
        </Link>
      </div>
    </footer>
  );
}
