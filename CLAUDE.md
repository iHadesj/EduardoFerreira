# Portfolio Hades — instruções do agente

## Contexto

Portfolio de Edu Ferreira (github.com/iHadesj), fullstack Java + React/TS.
A spec completa e OBRIGATÓRIA está em [docs/PLANO.md](docs/PLANO.md) — leia antes
de qualquer tarefa.

## Ambiente (importante)

- Stack real instalada: **Next.js 16** (App Router, Turbopack), **React 19**,
  **Tailwind v4**, **TypeScript strict**. Gerenciador: **pnpm**.
- O projeto vive em `C:\Users\Jordan\portfolio-hades`. O shell do sandbox não
  consegue escrever no diretório original do workspace (`...\EduardoFerreiraPort`);
  apenas as ferramentas Write/Edit conseguem. pnpm roda aqui.
- Cada chamada de shell reseta o cwd — sempre `cd` para a raiz do projeto antes
  de rodar pnpm.

## Rotas e i18n

- Duas locales: **PT** (padrão, URLs limpas: `/`, `/projetos/[slug]`) e **EN**
  (`/en`, `/en/projetos/[slug]`).
- Cada locale tem seu **próprio root layout** via route group:
  `src/app/(pt)/` e `src/app/(en)/en/`. Isso é deliberado — um segmento
  `[locale]` parametrizado impede o Next de renderizar `not-found.tsx` dentro do
  layout, e faria `<html lang>` depender de patch pós-hidratação.
- Arquivos de rota são finos de propósito: fixam a locale e delegam para
  `src/components/pages/*`. Toda cópia vive em `src/lib/i18n/dictionaries/`.
- `en.ts` usa `satisfies Dictionary` — adicionar chave em `pt.ts` quebra o build
  até traduzir. Dicionários são **dados puros** (sem função, sem JSX):
  interpole com `{placeholder}` + `fill()`.
- Nunca emita `/pt` em markup; construa href com `localePath`/`projectPath`.
- Client components pegam locale via `useI18n()`; server components recebem
  `dict` por prop. O slice do cliente (`getClientDictionary`) é o que atravessa
  a fronteira RSC — não importe o dicionário completo sob `"use client"`.

## Regras inegociáveis

- Siga as fases do PLANO.md em ordem; não avance com critérios de aceite pendentes.
- Design: **apenas tokens do `@theme`** (PLANO §2, definidos em
  `src/app/globals.css` + `src/styles/themes.css`). Anti-padrões da §2.2 são
  proibidos.
- TS strict, sem `any` (use `unknown` + narrow). Server Components por padrão;
  justifique todo `"use client"`.
- Acessibilidade e `prefers-reduced-motion` em TUDO (§2.7 e Fase 8).
- Segredos só em route handlers / server actions. Nunca no cliente.
- Performance budgets da Fase 8 são gates, não metas.
- Eyebrows com prefixo `//` devem ser renderizados como string
  (`{"// label"}`) ou via `<SectionHeading>` — texto `//` cru em JSX dispara
  `react/jsx-no-comment-textnodes`.

## Comandos

`pnpm dev` · `pnpm lint` · `pnpm typecheck` · `pnpm test` · `pnpm test:e2e` ·
`pnpm build` · `pnpm format`

## Ao terminar qualquer tarefa

1. `pnpm lint && pnpm typecheck && pnpm build` verdes.
2. Conventional Commit em inglês.
3. Reportar: o que fez, como testou, o que ficou pendente (`TODO_EDU`).
