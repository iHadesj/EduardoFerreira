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
