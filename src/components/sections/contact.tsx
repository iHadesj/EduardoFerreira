import { SectionHeading } from "@/components/ui/section-heading";
import { CopyEmail } from "@/components/sections/copy-email";
import { ContactForm } from "@/components/sections/contact-form";

export function Contact() {
  return (
    <section id="contato" className="container-hades section-pad scroll-mt-24">
      <SectionHeading
        eyebrow="contato"
        title="Bora construir algo?"
        description="Backend, frontend ou os dois — se o projeto tem engenharia de verdade, quero saber."
      />

      <div className="mt-10 flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-3">
          <p className="text-smoke text-sm">
            Prefere e-mail? Clique para copiar:
          </p>
          <CopyEmail />
          <p className="text-smoke text-sm">Respondo em até 48h.</p>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
