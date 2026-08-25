import { SectionHeading } from "@/components/ui/section-heading";
import { CopyEmail } from "@/components/sections/copy-email";
import { ContactForm } from "@/components/sections/contact-form";
import { ScrollSection } from "@/components/layout/scroll-flow";

export function Contact() {
  return (
    <ScrollSection
      id="contato"
      className="container-hades section-pad scroll-mt-24"
      flowStrength={18}
    >
      <SectionHeading
        eyebrow="contato"
        title="Bora trocar ideia?"
        description="Vaga, freela, uma dúvida ou só um oi — pode chamar. Back-end, front-end ou os dois, eu quero ouvir."
      />

      <div className="mt-10 flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-3">
          <p className="text-smoke text-sm">
            Prefere e-mail? Clica aí que já copia:
          </p>
          <CopyEmail />
          <p className="text-smoke text-sm">
            Costumo responder em um ou dois dias.
          </p>
        </div>

        <ContactForm />
      </div>
    </ScrollSection>
  );
}
