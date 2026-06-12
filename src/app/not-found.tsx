import Link from "next/link";
import type { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Alma perdida",
};

export default function NotFound() {
  return (
    <main
      id="conteudo"
      className="container-hades flex min-h-dvh flex-col items-center justify-center gap-6 text-center"
    >
      <p className="text-label text-molten font-mono uppercase">{"// 404"}</p>
      <h1 className="font-display text-hero text-bone">Alma perdida</h1>
      <p className="prose-measure text-smoke">
        Essa alma se perdeu no submundo. A página que você procura não existe —
        ou foi engolida pelo Estige.
      </p>
      <Link
        href="/"
        data-cursor="hover"
        className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
      >
        Voltar à superfície
      </Link>
    </main>
  );
}
