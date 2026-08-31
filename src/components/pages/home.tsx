import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { TechStack } from "@/components/sections/tech-stack";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { GithubActivity } from "@/components/sections/github-activity";
import { Contact } from "@/components/sections/contact";
import { ScrollFlow } from "@/components/layout/scroll-flow";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * Home page body, shared by both locale route groups. The route files are thin
 * on purpose: they exist to pin a locale and nothing else.
 */
export function HomePage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <ScrollFlow id="conteudo">
      <Hero dict={dict} />
      <About dict={dict} />
      <TechStack dict={dict} />
      <Projects locale={locale} dict={dict} />
      <Experience dict={dict} />
      <GithubActivity locale={locale} dict={dict} />
      <Contact locale={locale} dict={dict} />
    </ScrollFlow>
  );
}
