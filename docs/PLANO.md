# PLANO MESTRE — Portfolio "HADES" · Edu Ferreira (iHadesj)

> Spec executável para o **Claude Code** construir um portfolio de elite em
> **Next.js + React + TypeScript**, com 3D interativo, rolagem infinita,
> micro-interações de alto nível e performance de topo.
>
> Referências de mercado destiladas aqui dentro: `brittanychiang.com`
> (estrutura), `rauno.me` (craft), `bruno-simon.com` (momento 3D), `leerob.com`
> (conteúdo vivo).
>
> **North star:** "carrega como texto puro, surpreende como um jogo."

> **Nota de implementação:** a stack real instalada é Next.js 16 (Turbopack),
> React 19, Tailwind v4, TypeScript strict, pnpm. O projeto vive em
> `C:\Users\Jordan\portfolio-hades` (ver CLAUDE.md para o porquê).

---

## 1. Visão geral & posicionamento

### 1.1 O que estamos roubando de cada portfolio famoso

| Referência         | O que pegamos                                                                                                     | O que NÃO pegamos                           |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| brittanychiang.com | Layout de duas colunas no desktop, scroll-spy na navegação, hover states cirúrgicos em cards                      | Ausência de identidade visual forte         |
| rauno.me           | Obsessão por micro-interação, `prefers-reduced-motion` como cidadão de primeira classe, detalhes de cursor e foco | Excesso de abstração no conteúdo            |
| bruno-simon.com    | UM momento 3D memorável que vende o site                                                                          | O peso: o nosso é lazy, leve e com fallback |
| leerob.com         | Case studies e conteúdo vivo que prova senioridade                                                                | Visual genérico de docs                     |

### 1.2 Posicionamento do Edu

- **Headline:** Fullstack **Java + React/TypeScript**.
- **O próprio portfolio é o case study de frontend.**
- **Projetos âncora** (`github.com/iHadesj`): `DetranDiff`, `JPA_PostgreSQL` +
  `Projeto_CRUD` (consolidados), `Cons-rcioDigital`.
- **Público-alvo:** tech recruiters e tech leads BR/gringa → i18n PT/EN e
  métricas em todo case.

### 1.3 Definição de sucesso (mensurável)

- Lighthouse (mobile): Performance ≥ 95, A11y = 100, Best Practices = 100,
  SEO = 100.
- LCP < 1.2s, CLS < 0.05, INP < 200ms em 4G simulado.
- JS inicial (sem chunk 3D) < 160 KB gzip. Chunk 3D < 300 KB gzip.
- 100% navegável por teclado; zero erro no axe-core.
- Tempo até "uau": < 3s.

---

## 2. Direção de design — conceito "SUBMUNDO"

### 2.1 Conceito

Hades como **Plouton, deus das riquezas do subsolo**: **escuridão de obsidiana +
ouro fundido**, não neon de hacker. Sofisticado, mitológico, sóbrio. Toda a
ousadia é gasta em **UM lugar** (a assinatura, §2.6). O resto é disciplina.

### 2.2 Anti-padrões — PROIBIDO

- Barra de skill com porcentagem ("Java 90%").
- Copy genérica: "apaixonado por tecnologia", "transformando ideias em código".
- Verde-ácido/ciano neon sobre preto puro.
- Mais de uma animação de entrada simultânea na mesma dobra.
- shadcn/ui cru sem retematizar tokens.
- Som autoplay. Cursor custom no mobile. Scroll hijacking.

### 2.3 Paleta (tokens canônicos)

Definidos no Tailwind v4 via `@theme` em `app/globals.css`. Dark é o default.

| Token                 | Hex       | Papel                          |
| --------------------- | --------- | ------------------------------ |
| `--color-abyss`       | `#0E0C12` | Fundo base                     |
| `--color-basalt`      | `#16131C` | Superfícies/cards              |
| `--color-ash`         | `#2B2535` | Bordas, divisores              |
| `--color-bone`        | `#EDE8DF` | Texto primário                 |
| `--color-smoke`       | `#9A92A8` | Texto secundário               |
| `--color-molten`      | `#E8A33D` | Acento primário — ouro fundido |
| `--color-molten-deep` | `#C97E1B` | Hover/pressed do ouro          |
| `--color-ember`       | `#E04E2F` | Acento raro — brasa            |
| `--color-styx`        | `#3E7C8C` | Acento frio raríssimo          |

- **Gradiente assinatura** `--gradient-molten`:
  `linear-gradient(135deg, #F2C14E 0%, #E8A33D 45%, #D96C2C 100%)`.
- **Glow padrão** `--glow-molten`: borda + sombra dourada translúcida.
- **Tema claro "Elysium"**: fundo `#F5F1E8`, superfície `#FFFFFF`, texto
  `#1C1820`, ouro `#A8741F` (AA), bordas `#E2DBCC`. Via `[data-theme="light"]`.
- **Tema secreto "Underworld"** (Fase 7): ember protagonista, grain sobe,
  partículas dobram.
- Regra: todo par texto/fundo passa **WCAG AA**.

### 2.4 Tipografia

| Papel   | Fonte                                 | Pesos         |
| ------- | ------------------------------------- | ------------- |
| Display | **Clash Display** (local)             | 500, 600      |
| Corpo   | **Satoshi** (local)                   | 400, 500, 700 |
| Mono    | **JetBrains Mono** (next/font/google) | 400, 500      |

- Fallback aprovado: `Geist` + `Geist Mono`. Subset `latin` + `latin-ext`,
  `display: swap`, zero CLS de fonte.
- Type scale fluida (tokens): `--text-hero` `clamp(2.75rem, 8vw, 6rem)`/0.95/
  -0.02em/600; `--text-h2` `clamp(1.75rem,4vw,2.75rem)`/1.1/500; `--text-h3`
  `clamp(1.25rem,2.5vw,1.5rem)`/1.25/700; `--text-body` `1rem/1.7`; `--text-lead`
  `1.125rem/1.7`; `--text-label` `0.8125rem` mono uppercase tracking 0.08em.
- Largura de leitura: prosa `max-width: 65ch`.

### 2.5 Espaçamento, raio, elevação, z-index

- Grid base 4px; seções `padding-block: clamp(5rem, 12vh, 9rem)`.
- Container `max-width: 72rem`, `padding-inline: clamp(1.25rem, 4vw, 2.5rem)`.
- Raios `--radius-sm:6px` `--radius-md:12px` `--radius-lg:20px` pill `9999px`.
- Elevação no dark = **borda + glow**, não sombra preta.
- z-index nomeado: `--z-nav:50` `--z-palette:60` `--z-cursor:70` `--z-toast:80`.

### 2.6 Assinatura visual

**Hero "Fragmento de Obsidiana"**: sólido low-poly preto-violeta facetado
flutuando, arestas que acendem em ouro com o mouse, ~1.200 partículas de brasa
subindo. Título com _text scramble_ resolvendo em "Edu Ferreira". Tudo ao redor é
quieto.

### 2.7 Linguagem de movimento (regras globais)

- Durations: micro `150–250ms`; reveal `500–700ms`; tema/rota `300ms`. Nada
  acima de 700ms exceto o 3D.
- Easing padrão `cubic-bezier(0.16, 1, 0.3, 1)`. Saídas `ease-in` curto.
- Reveals: `opacity 0→1` + `translateY 24px→0`, `once: true`, stagger `60–90ms`,
  viewport `-12%`.
- `prefers-reduced-motion: reduce` → kill-switch global.

---

## 3. Stack técnica

`next` (16, App Router) · `react`/`react-dom` (19) · `typescript` (strict) ·
`tailwindcss` (v4) · `motion` (Framer Motion v12+) · `lenis` · `three` +
`@react-three/fiber` (v9) + `@react-three/drei` · `@react-three/postprocessing` ·
`@tanstack/react-query` (v5, rolagem infinita) · `cmdk` (⌘K) · `next-themes` ·
`velite` (MDX tipado) · `zod` · `resend` + `react-email` · `@vercel/analytics` +
`@vercel/speed-insights` · `lucide-react`. Dev: `eslint` (flat) + `prettier` +
`prettier-plugin-tailwindcss` · `vitest` + `@testing-library/react` + `jsdom` ·
`playwright` + `@axe-core/playwright` · `@lhci/cli`. Gerenciador `pnpm`, Node ≥ 20.

---

## 4. Arquitetura & estrutura de pastas

Ver árvore completa no plano original. Resumo: `src/app` (rotas, layout,
globals.css, api/github, sitemap/robots/manifest, opengraph), `src/components`
(`ui/`, `layout/`, `three/`, `sections/`), `src/lib` (github, env, site-config,
actions, utils), `src/hooks`, `src/styles/themes.css`, `content/projects/*.mdx`,
`tests/`, `velite.config.ts`, `lighthouserc.json`, `.github/workflows/ci.yml`.

---

## 5. Convenções de código

1. TS estrito: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`. Sem
   `any`.
2. Server Components por padrão; `"use client"` só com interação/3D/motion.
   Segredos só no servidor.
3. Componentes: PascalCase export, kebab-case arquivo. Props `interface XProps`.
4. Tailwind utilitário; `cn()` para condicionais. Sem CSS-in-JS.
5. Animações compartilhadas em `lib/motion-presets.ts`.
6. Conventional Commits, mensagens em inglês.
7. A11y é convenção: foco visível e nome acessível em tudo.
8. Imagens sempre `next/image`.

---

# FASES DE EXECUÇÃO

## FASE 0 — Bootstrap & tooling

Projeto rodando com lint, tipos, tokens e fontes. Critérios: `lint+typecheck+
build` verdes; fundo abyss / texto bone / 3 fontes sem CLS; nenhuma cor fora de
token.

## FASE 1 — Design system & primitivas (`components/ui/`)

button, badge, card, section-heading, reveal, magnetic, marquee, scramble-text,
theme-toggle, custom-cursor, kbd. Página de teste `/dev/ui` (removida na Fase 11).
Critérios: foco molten em tudo nos 2 temas; marquee pausa no hover e vira grid
com reduced motion; nenhuma cor fora de token.

## FASE 2 — Layout global, navegação & ⌘K

layout.tsx (providers: ThemeProvider → QueryProvider → MotionConfig → Lenis →
children; SkipLink), LenisProvider, navbar (scroll-spy, hide-on-scroll),
mobile-nav (focus trap, Esc), command-menu (cmdk), footer. Critérios: scroll-spy
correto; ⌘K abre/filtra/executa e devolve foco; navegação por teclado completa;
zero CLS da navbar.

## FASE 3 — Hero 3D "Fragmento de Obsidiana"

Carregamento: fallback estático (LCP) → 3D lazy pós-idle com gates (reduced
motion, pointer/viewport, deviceMemory, WebGL2, saveData). Cena: obsidian-shard,
ember-particles (1.200), luzes, bloom condicional, PerformanceMonitor (degradação
progressiva). Critérios: chunk 3D < 300 KB gz; 60fps; reduced motion/mobile = zero
bytes de three; LCP < 1.2s.

## FASE 4 — Seções de conteúdo da home

hero, about, tech-stack (2 marquees), projects (cards largos), experience
(timeline), contact (server action + zod + honeypot + Resend), not-found.
Critérios: responsivo 360/768/1024/1440; form acessível; textos definitivos ou
`TODO_EDU`.

## FASE 5 — Case studies em MDX tipado (velite)

Schema zod; template obrigatório (O problema → Decisões técnicas → Arquitetura →
Resultados → O que eu faria diferente). 4 cases: detrandiff, api-java-postgresql,
consorcio-digital, portfolio-hades. Rotas `/projetos/[slug]`.

## FASE 6 — Integração GitHub + ROLAGEM INFINITA

lib/github.ts (DTOs), api/github/repos (proxy paginado), api/github/contributions
(heatmap), github-activity section com `useInfiniteQuery`, sentinela +
IntersectionObserver + fallback "Carregar mais". Primeira página SSR como
initialData. Funciona sem token (cache 1h).

## FASE 7 — Micro-interações, transições & easter eggs

View Transitions, toasts, links externos, ::selection, scrollbar custom,
use-konami (modo Underworld), título da aba ao sair. Tudo respeita reduced motion.

## FASE 8 — Acessibilidade & Performance (gates duros)

Landmarks, foco, contraste AA, aria-live, touch targets. next/image, bundle
analyzer, RSC. Lighthouse ≥95/100/100/100; axe zero; JS inicial <160KB gz; 3D
<300KB gz; CLS<0.05; LCP<1.2s.

## FASE 9 — SEO, metadata, OG dinâmica & i18n

generateMetadata, JSON-LD (Person/Article), sitemap/robots, OG dinâmica
(next/og), favicon facetado, i18n PT/EN (next-intl).

## FASE 10 — Testes & CI

Vitest (utils, schema, paginação, componentes), Playwright (home, a11y, motion),
Lighthouse CI, GitHub Actions, README vitrine.

## FASE 11 — Deploy, conteúdo final & QA

Vercel + env + domínio + Analytics. Resolver TODO_EDU. Deletar /dev/ui. QA manual
multi-browser + screen reader. Divulgação.

---

## 6. Definition of Done global

- Sem erro/warning novo no console.
- `lint && typecheck && test && build` verdes.
- Funciona com teclado, reduced motion, 360px, offline-friendly.
- Nenhum segredo no cliente; nenhuma cor fora de token; nenhum clichê da §2.2.

## 7. Backlog v2

`/blog` · `/uses` e `/now` · modo terminal · guestbook · som UI opt-in · testes
visuais · RSS · Storybook.

---

_Documento condensado a partir da spec original fornecida pelo Edu. A versão
integral foi recebida no chat de origem; este arquivo preserva todas as decisões,
tokens e critérios de aceite para referência em-repo._
