import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { TechStack } from "@/components/sections/tech-stack";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { GithubActivity } from "@/components/sections/github-activity";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <main id="conteudo">
      <Hero />
      <About />
      <TechStack />
      <Projects />
      <Experience />
      <GithubActivity />
      <Contact />
    </main>
  );
}
