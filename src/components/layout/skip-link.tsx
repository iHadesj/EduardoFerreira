/** First focusable element — jumps screen-reader / keyboard users to content. */
export function SkipLink() {
  return (
    <a
      href="#conteudo"
      className="focus-visible:border-molten focus-visible:bg-basalt focus-visible:text-bone sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[var(--z-toast)] focus-visible:rounded-md focus-visible:border focus-visible:px-4 focus-visible:py-2 focus-visible:font-mono focus-visible:text-sm"
    >
      Pular para o conteúdo
    </a>
  );
}
