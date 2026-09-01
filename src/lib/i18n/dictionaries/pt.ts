/**
 * Canonical dictionary. `en.ts` is typed `satisfies Dictionary`, so anything
 * added here fails the build until it is translated there too.
 *
 * Rules for this file:
 * - Pure data. The client slice crosses the RSC boundary, so no functions and
 *   no JSX — interpolate with `{placeholders}` + `fill()` from `../format`.
 * - Emphasis inside prose is expressed as `{ em: "…" }` segments and rendered
 *   by `<RichText>`; that keeps markup decisions out of the copy.
 */

export type RichNode = string | { readonly em: string };
export type Rich = readonly RichNode[];

export const pt = {
  meta: {
    title: "Edu Ferreira — Desenvolvedor Fullstack Java & React/TypeScript",
    description:
      "Backend em Java/Spring, frontend em React e TypeScript. Atualmente afiando arquitetura, testes e performance.",
    ogEyebrow: "portfólio",
  },

  common: {
    /**
     * Both of these describe the locale being *offered*, not the current one,
     * and are written in that target language: a reader who cannot read this
     * page still recognises the way out. Keeping them in the active
     * dictionary avoids pulling the other one into the client bundle.
     */
    otherLocaleShort: "EN",
    switchLanguage: "View in English",
    emailCopied: "E-mail copiado",
    downloadingCv: "Baixando currículo…",
    themeToggle: "Alternar tema",
    themeToDark: "Ativar tema escuro",
    themeToLight: "Ativar tema claro",
  },

  nav: {
    main: "Navegação principal",
    footer: "Rodapé",
    home: "Início — Edu Ferreira",
    commands: "Comandos",
    openCommands: "Abrir paleta de comandos",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    menuLabel: "Menu de navegação",
    skipToContent: "Pular para o conteúdo",
  },

  hero: {
    eyebrow: "// fullstack developer — java & react",
    taglineLead: "Stack",
    taglineAccent: "completa",
    description:
      "Backend em Java/Spring, frontend em React e TypeScript. Atualmente focando em arquitetura, testes e performance.",
    ctaProjects: "Ver projetos",
    ctaCv: "Baixar CV",
    ctaCvAria: "Baixar currículo em PDF",
    availabilityOpen: "Aberto a oportunidades",
    availabilityClosed: "Sem disponibilidade no momento",
    availabilityAria: "Disponibilidade profissional",
    scrollCue: "scroll",
  },

  about: {
    eyebrow: "sobre",
    title: "Interessado desde o primeiro CRUD.",
    paragraphs: [
      [
        "Comecei pelo back-end — Java, Spring, banco de dados — porque queria entender o que acontece ",
        { em: "atrás da tela" },
        ". Modelar os dados, separar as camadas, escrever um teste e ver ele pegar o erro antes de mim: foi aí que caiu a ficha.",
      ],
      [
        "Depois fui pro front com React e TypeScript e descobri que gosto dos dois stacks. Este site é minha área de ",
        { em: "experimentos" },
        " — está tudo no GitHub, com o que foi concluído e o que eu ainda quero melhorar.",
      ],
    ] as readonly Rich[],
    facts: [
      { key: "onde", value: "São Paulo - Zona Sul" },
      { key: "no dia a dia", value: "Java · Spring · React · TS" },
      { key: "aprendendo", value: "JUnit · Machine Learning · Zustand" },
    ],
    statusLabel: "status",
    portraitAlt: "Retrato de Edu Ferreira",
    portraitPending: "foto a caminho",
  },

  stack: {
    eyebrow: "stack em prática",
    title: "Ferramentas que viraram produto.",
    description:
      "Organizadas pelo problema que resolvem — e conectadas aos projetos em que foram usadas.",
    proofTitle: "Stack validada no código",
    proofLink: "ver repositórios no GitHub ↗",
    proofAria: "Ver os repositórios de Edu Ferreira no GitHub",
    toolsAria: "Tecnologias de {title}",
    whereUsed: "onde aparece",
    groups: [
      {
        label: "stack principal",
        title: "Frontend & produto",
        description:
          "Interfaces tipadas, responsivas e pensadas como produto — da arquitetura ao último estado de interação.",
        projects: "Levva · RotaDev · Portfólio",
      },
      {
        label: "servidor & realtime",
        title: "Backend & APIs",
        description:
          "APIs REST, autenticação, validação de contratos e experiências multiplayer orientadas a eventos.",
        projects: "StudyQuest · API Java",
      },
      {
        label: "estado & persistência",
        title: "Dados",
        description:
          "Estado previsível no cliente e persistência escolhida de acordo com o domínio do produto.",
        projects: "Levva · StudyQuest · API Java",
      },
      {
        label: "interface avançada",
        title: "Motion & experiência",
        description:
          "Movimento, áudio e 3D usados para explicar ações e criar experiências que ficam na memória.",
        projects: "Portfólio · RotaDev · Change",
      },
      {
        label: "confiança & entrega",
        title: "Qualidade",
        description:
          "Testes e ferramentas de entrega aplicados onde uma regressão realmente custa confiança.",
        projects: "Levva · Java · projetos web",
      },
    ],
  },

  projects: {
    eyebrow: "projetos",
    title: "Coisas que eu construí.",
    description:
      "Em cada um eu conto o que queria resolver, como resolvi e o que faria diferente hoje.",
    moreOnGithub: "Tem mais coisa no meu GitHub ↓",
    caseStudy: "Case study →",
    repoAria: "Repositório de {title}",
    demoAria: "Demo de {title}",
    coverAlt: "Tela do projeto {title}",
    statuses: {
      shipped: "no ar",
      "in-progress": "em progresso",
      archived: "arquivado",
    },
  },

  experience: {
    eyebrow: "trajetória",
    title: "Como eu cheguei até aqui.",
    items: [
      {
        period: "2025 — agora",
        role: "Estagiário de Desenvolvimento Web",
        org: "VTT",
        bullets: [
          "Minha primeira experiência com projeto de verdade: prazo, gente usando e código que não é só meu — bem diferente de estudar sozinho",
        ],
        stack: ["React", "TypeScript", "Java"],
      },
      {
        period: "fev 2025 — agora",
        role: "Bacharelado em Análise e Desenvolvimento de Sistemas",
        org: "Estácio",
        bullets: [
          "Faculdade e estágio ao mesmo tempo: o que vejo na aula costuma aparecer no trabalho na semana seguinte",
          "É onde eu pego a base que não dá pra aprender só no tutorial: estruturas de dados, banco e arquitetura",
        ],
        stack: ["Estruturas de dados", "POO", "SQL"],
      },
      {
        period: "2024 — agora",
        role: "Desenvolvedor Fullstack",
        org: "projetos próprios",
        bullets: [
          "Onde eu testo ideias sem medo de quebrar nada: React, TypeScript e Next.js em coisas como o StudyQuest e este site",
          "Banco de dados fora do slide, aprendendo na tentativa e erro: PostgreSQL e MySQL",
        ],
        stack: ["React", "TypeScript", "Next.js", "PostgreSQL"],
      },
      {
        period: "2023 — 2024",
        role: "Especialização Back-End Java",
        org: "EBAC",
        bullets: [
          "Foi aqui que o Java virou minha base: POO, JPA/Hibernate e persistência com PostgreSQL",
          "Muito CRUD em MVC com JUnit — foi o que virou o projeto API Java + PostgreSQL ali em cima",
        ],
        stack: ["Java", "JPA/Hibernate", "PostgreSQL", "JUnit"],
      },
    ],
  },

  github: {
    eyebrow: "github",
    title: "Meu GitHub, ao vivo.",
    description:
      "Puxado direto da API, então é o que está lá de verdade — inclusive os dias em que eu não commitei nada.",
    contributionsSuffix: "contribuições no último ano",
    contributionsAria: "{total} contribuições no último ano",
    contributionsDay: "{count} contribuições em {date}",
    feed: {
      error: "O oráculo do GitHub não respondeu.",
      retry: "Tentar de novo",
      showArchive: "Ver repositórios anteriores",
      loadMore: "Carregar mais",
      loading: "Carregando…",
      archiveLabel: "// arquivo",
      endOfArchive: "fim do arquivo — por enquanto.",
      loadError: "não consegui carregar mais agora.",
      emptyWindow: "nenhum repositório com push nos últimos {months} meses.",
      noDescription: "Sem descrição.",
    },
  },

  contact: {
    eyebrow: "contato",
    title: "Quer entrar em contato?",
    description:
      "Vaga, freela, uma dúvida — pode chamar. Back-end, front-end ou os dois.",
    preferEmail: "Prefere e-mail? Clica que já copia:",
    replyTime: "Costumo responder de um a dois dias.",
    form: {
      name: "Nome",
      email: "E-mail",
      message: "Mensagem",
      submit: "Enviar mensagem",
      sending: "Enviando…",
      honeypot: "Não preencha este campo",
      fallbackSuccess: "Mensagem enviada.",
    },
  },

  /** Server-action copy. Resolved on the server from the submitted locale. */
  contactAction: {
    success: "Mensagem enviada. Respondo em até 48h.",
    successDev: "Mensagem enviada (modo dev). Respondo em até 48h.",
    invalid: "Confira os campos destacados.",
    rateLimited: "Muitas tentativas. Tente novamente em alguns minutos.",
    sendError: "Não consegui enviar agora. Tente novamente em instantes.",
    emailSubject: "Novo contato de {name}",
    validation: {
      nameShort: "Nome muito curto",
      emailInvalid: "E-mail inválido",
      messageShort: "Conte um pouco mais (mín. 10 caracteres)",
    },
  },

  footer: {
    blurb:
      "Dev fullstack: Java no back, React e TypeScript no front. Aprendendo um pouco mais todo dia.",
    copyright:
      "© {year} Edu Ferreira — feito com Next.js, persistência e muito café 🙏.",
    viewSource: "ver código-fonte ↗",
  },

  commandMenu: {
    label: "Paleta de comandos",
    placeholder: "Buscar ou navegar…",
    empty: "Nenhum resultado.",
    groupNav: "Navegar",
    groupActions: "Ações",
    groupSecret: "Secreto",
    copyEmail: "Copiar e-mail",
    downloadCv: "Baixar CV",
    openGithub: "Abrir GitHub",
    switchTheme: "Mudar tema",
    switchLanguage: "Read in English",
    descend: "Descer ao submundo",
    descendToast: "Você desceu ao submundo.",
    /** cmdk matches against these, so keep the synonyms generous. */
    keywords: {
      nav: "navegar",
      copyEmail: "copiar email contato",
      downloadCv: "baixar cv curriculo",
      openGithub: "abrir github",
      switchTheme: "mudar tema claro escuro",
      switchLanguage: "idioma lingua ingles english",
      descend: "hades descer ao submundo underworld",
    },
  },

  notFound: {
    metaTitle: "Alma perdida",
    eyebrow: "// 404",
    title: "Alma perdida",
    description:
      "Essa alma se perdeu no submundo. A página que você procura não existe — ou foi engolida pelo Estige.",
    cta: "Voltar à superfície",
  },

  easterEggs: {
    consoleHint:
      "// procurando easter eggs? manda um oi: {email}  ·  ↑↑↓↓←→←→ B A",
    tabTitle: "👁 o submundo aguarda…",
    toUnderworld: "Você desceu ao submundo. (konami pra voltar)",
    toSurface: "De volta à superfície.",
    gate: {
      eyebrow: "// eco encontrado",
      ariaEnter: "Mantenha pressionado para entrar no submundo",
      ariaExit: "Mantenha pressionado para voltar à superfície",
      titleEnter: "Há algo sob a superfície",
      titleExit: "Retornar à superfície",
      hint: "mantenha pressionado",
      hintEnter: "O símbolo responde à pressão. Mantenha-o pressionado.",
      hintExit:
        "O caminho de volta exige que você mantenha o selo pressionado.",
      toastEnter: "O selo se rompeu. Bem-vindo ao submundo.",
      toastExit: "A superfície te aceita de volta.",
    },
  },

  projectPage: {
    /** Eyebrow burned into the generated Open Graph card. */
    ogEyebrow: "case study",
    back: "Voltar",
    repo: "Repositório",
    demo: "Demo ao vivo",
    decisionsEyebrow: "decision log",
    decisionsTitle: "Decisões que moldaram o projeto.",
    decisionsDescription:
      "O que eu escolhi, o que descartei junto e o preço que isso cobrou.",
    chose: "escolhi",
    instead: "em vez de",
    because: "porque",
    cost: "custou",
    /**
     * Rendered above the MDX body when non-empty. The long-form case studies
     * are authored in PT, so only the EN dictionary fills this in — an empty
     * string means "this locale reads the body natively, show nothing".
     */
    translationNotice: "",
  },
};

/**
 * Deliberately NOT `as const`: the shape is the contract, the literals are not.
 * `en.ts` satisfies this, so a missing key breaks the build while a different
 * translation of the same key does not.
 */
export type Dictionary = typeof pt;
