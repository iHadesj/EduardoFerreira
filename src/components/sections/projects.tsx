import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ProjectCard } from "@/components/sections/project-card";
import { SmoothLink } from "@/components/ui/smooth-link";
import { projects } from "@/lib/projects";

export function Projects() {
  return (
    <section id="projetos" className="container-hades section-pad scroll-mt-24">
      <SectionHeading
        eyebrow="projetos em destaque"
        title="Engenharia que se lê como narrativa."
        description="Cada projeto é um case study: o problema, as decisões técnicas e os trade-offs — não só screenshots."
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
          Ver arquivo completo no GitHub ↓
        </SmoothLink>
      </div>
    </section>
  );
}
