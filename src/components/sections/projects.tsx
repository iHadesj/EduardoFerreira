import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ProjectCard } from "@/components/sections/project-card";
import { SmoothLink } from "@/components/ui/smooth-link";
import { projects } from "@/lib/projects";
import { ScrollSection } from "@/components/layout/scroll-flow";

export function Projects() {
  return (
    <ScrollSection
      id="projetos"
      className="container-hades section-pad scroll-mt-24"
      flowStrength={18}
    >
      <SectionHeading
        eyebrow="projetos"
        title="Coisas que eu construí."
        description="Em cada um eu conto o que queria resolver, como resolvi e o que faria diferente hoje. Nem tudo saiu perfeito, e isso também está escrito lá."
      />

      <div className="mt-10 flex flex-col gap-6">
        {projects.map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.06}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>

      <div className="mt-8">
        <SmoothLink
          href="#github"
          data-cursor="hover"
          className="link-underline text-smoke text-sm hover:bg-[length:100%_1px]"
        >
          Tem mais coisa no meu GitHub ↓
        </SmoothLink>
      </div>
    </ScrollSection>
  );
}
