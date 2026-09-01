import type { Dictionary, Rich } from "@/lib/i18n/dictionaries/pt";

/**
 * English translation. `satisfies Dictionary` is the parity gate: add a key to
 * `pt.ts` and this file stops compiling until it is translated.
 */
export const en = {
  meta: {
    title: "Edu Ferreira — Fullstack Developer, Java & React/TypeScript",
    description:
      "Java/Spring on the back end, React and TypeScript on the front. Currently sharpening architecture, testing and performance.",
    ogEyebrow: "portfolio",
  },

  common: {
    otherLocaleShort: "PT",
    switchLanguage: "Ver em português",
    emailCopied: "E-mail copied",
    downloadingCv: "Downloading CV…",
    themeToggle: "Toggle theme",
    themeToDark: "Switch to dark theme",
    themeToLight: "Switch to light theme",
  },

  nav: {
    main: "Main navigation",
    footer: "Footer",
    home: "Home — Edu Ferreira",
    commands: "Commands",
    openCommands: "Open command palette",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuLabel: "Navigation menu",
    skipToContent: "Skip to content",
  },

  hero: {
    eyebrow: "// fullstack developer — java & react",
    taglineLead: "Full stack,",
    taglineAccent: "fully",
    description:
      "Java/Spring on the back end, React and TypeScript on the front. Currently focused on architecture, testing and performance.",
    ctaProjects: "See projects",
    ctaCv: "Download CV",
    ctaCvAria: "Download résumé as PDF",
    availabilityOpen: "Open to opportunities",
    availabilityClosed: "Not available right now",
    availabilityAria: "Professional availability",
    scrollCue: "scroll",
  },

  about: {
    eyebrow: "about",
    title: "Hooked since the first CRUD.",
    paragraphs: [
      [
        "I started on the back end — Java, Spring, databases — because I wanted to understand what happens ",
        { em: "behind the screen" },
        ". Modelling the data, separating the layers, writing a test and watching it catch the bug before I did: that's when it clicked.",
      ],
      [
        "Then I moved to the front with React and TypeScript and found out I like both stacks. This site is my ",
        { em: "playground" },
        " — it's all on GitHub, with what's finished and what I still want to improve.",
      ],
    ] as readonly Rich[],
    facts: [
      { key: "based in", value: "São Paulo, BR" },
      { key: "day to day", value: "Java · Spring · React · TS" },
      { key: "learning", value: "JUnit · Machine Learning · Zustand" },
    ],
    statusLabel: "status",
    portraitAlt: "Portrait of Edu Ferreira",
    portraitPending: "photo coming soon",
  },

  stack: {
    eyebrow: "stack in practice",
    title: "Tools that turned into products.",
    description:
      "Grouped by the problem they solve — and linked to the projects they were used in.",
    proofTitle: "Stack proven in code",
    proofLink: "browse the repositories on GitHub ↗",
    proofAria: "Browse Edu Ferreira's repositories on GitHub",
    toolsAria: "{title} technologies",
    whereUsed: "where it shows up",
    groups: [
      {
        label: "core stack",
        title: "Frontend & product",
        description:
          "Typed, responsive interfaces designed as product — from architecture down to the last interaction state.",
        projects: "Levva · RotaDev · Portfolio",
      },
      {
        label: "server & realtime",
        title: "Backend & APIs",
        description:
          "REST APIs, authentication, contract validation and event-driven multiplayer experiences.",
        projects: "StudyQuest · Java API",
      },
      {
        label: "state & persistence",
        title: "Data",
        description:
          "Predictable client state and persistence picked to fit the product's domain.",
        projects: "Levva · StudyQuest · Java API",
      },
      {
        label: "advanced interface",
        title: "Motion & experience",
        description:
          "Movement, audio and 3D used to explain actions and build experiences that stick.",
        projects: "Portfolio · RotaDev · Change",
      },
      {
        label: "confidence & delivery",
        title: "Quality",
        description:
          "Tests and delivery tooling applied where a regression actually costs trust.",
        projects: "Levva · Java · web projects",
      },
    ],
  },

  projects: {
    eyebrow: "projects",
    title: "Things I've built.",
    description:
      "For each one I walk through what I set out to solve, how I solved it, and what I'd do differently today.",
    moreOnGithub: "There's more on my GitHub ↓",
    caseStudy: "Case study →",
    repoAria: "Repository for {title}",
    demoAria: "Live demo of {title}",
    coverAlt: "Screenshot of {title}",
    statuses: {
      shipped: "shipped",
      "in-progress": "in progress",
      archived: "archived",
    },
  },

  experience: {
    eyebrow: "trajectory",
    title: "How I got here.",
    items: [
      {
        period: "2025 — now",
        role: "Web Development Intern",
        org: "VTT",
        bullets: [
          "My first taste of a real project: deadlines, actual users, and code that isn't only mine — nothing like studying on your own",
        ],
        stack: ["React", "TypeScript", "Java"],
      },
      {
        period: "Feb 2025 — now",
        role: "BSc in Systems Analysis and Development",
        org: "Estácio",
        bullets: [
          "University and an internship at the same time: what I see in class usually shows up at work the week after",
          "It's where I pick up the foundation you can't get from tutorials alone: data structures, databases and architecture",
        ],
        stack: ["Data structures", "OOP", "SQL"],
      },
      {
        period: "2024 — now",
        role: "Fullstack Developer",
        org: "personal projects",
        bullets: [
          "Where I test ideas without fear of breaking anything: React, TypeScript and Next.js in things like StudyQuest and this site",
          "Databases outside the slides, learned by trial and error: PostgreSQL and MySQL",
        ],
        stack: ["React", "TypeScript", "Next.js", "PostgreSQL"],
      },
      {
        period: "2023 — 2024",
        role: "Java Back-End Specialisation",
        org: "EBAC",
        bullets: [
          "This is where Java became my foundation: OOP, JPA/Hibernate and persistence with PostgreSQL",
          "A lot of MVC CRUD with JUnit — that's what became the Java API + PostgreSQL project above",
        ],
        stack: ["Java", "JPA/Hibernate", "PostgreSQL", "JUnit"],
      },
    ],
  },

  github: {
    eyebrow: "github",
    title: "My GitHub, live.",
    description:
      "Pulled straight from the API, so it's what's actually there — including the days I didn't commit anything.",
    contributionsSuffix: "contributions in the last year",
    contributionsAria: "{total} contributions in the last year",
    contributionsDay: "{count} contributions on {date}",
    feed: {
      error: "The GitHub oracle didn't answer.",
      retry: "Try again",
      showArchive: "See earlier repositories",
      loadMore: "Load more",
      loading: "Loading…",
      archiveLabel: "// archive",
      endOfArchive: "end of the archive — for now.",
      loadError: "couldn't load any more right now.",
      emptyWindow: "no repository pushed in the last {months} months.",
      noDescription: "No description.",
    },
  },

  contact: {
    eyebrow: "contact",
    title: "Want to get in touch?",
    description:
      "A role, freelance work, a question — reach out. Back end, front end or both.",
    preferEmail: "Prefer e-mail? Click to copy it:",
    replyTime: "I usually reply within a day or two.",
    form: {
      name: "Name",
      email: "E-mail",
      message: "Message",
      submit: "Send message",
      sending: "Sending…",
      honeypot: "Do not fill in this field",
      fallbackSuccess: "Message sent.",
    },
  },

  contactAction: {
    success: "Message sent. I'll reply within 48h.",
    successDev: "Message sent (dev mode). I'll reply within 48h.",
    invalid: "Check the highlighted fields.",
    rateLimited: "Too many attempts. Try again in a few minutes.",
    sendError: "I couldn't send it right now. Try again in a moment.",
    emailSubject: "New message from {name}",
    validation: {
      nameShort: "Name is too short",
      emailInvalid: "Invalid e-mail",
      messageShort: "Tell me a bit more (min. 10 characters)",
    },
  },

  footer: {
    blurb:
      "Fullstack dev: Java on the back, React and TypeScript on the front. Learning a bit more every day.",
    copyright:
      "© {year} Edu Ferreira — built with Next.js, stubbornness and a lot of coffee 🙏.",
    viewSource: "view source ↗",
  },

  commandMenu: {
    label: "Command palette",
    placeholder: "Search or navigate…",
    empty: "No results.",
    groupNav: "Navigate",
    groupActions: "Actions",
    groupSecret: "Secret",
    copyEmail: "Copy e-mail",
    downloadCv: "Download CV",
    openGithub: "Open GitHub",
    switchTheme: "Switch theme",
    switchLanguage: "Ler em português",
    descend: "Descend to the underworld",
    descendToast: "You have descended to the underworld.",
    keywords: {
      nav: "navigate go to",
      copyEmail: "copy email contact address",
      downloadCv: "download cv resume curriculum",
      openGithub: "open github profile",
      switchTheme: "switch change theme light dark",
      switchLanguage: "language portuguese portugues idioma",
      descend: "hades descend underworld secret",
    },
  },

  notFound: {
    metaTitle: "Lost soul",
    eyebrow: "// 404",
    title: "Lost soul",
    description:
      "This soul got lost in the underworld. The page you're looking for doesn't exist — or the Styx swallowed it.",
    cta: "Back to the surface",
  },

  easterEggs: {
    consoleHint: "// hunting for easter eggs? say hi: {email}  ·  ↑↑↓↓←→←→ B A",
    tabTitle: "👁 the underworld awaits…",
    toUnderworld: "You have descended to the underworld. (konami to return)",
    toSurface: "Back to the surface.",
    gate: {
      eyebrow: "// echo found",
      ariaEnter: "Press and hold to enter the underworld",
      ariaExit: "Press and hold to return to the surface",
      titleEnter: "There's something beneath the surface",
      titleExit: "Return to the surface",
      hint: "press and hold",
      hintEnter: "The symbol answers to pressure. Hold it down.",
      hintExit: "The way back demands that you hold the seal down.",
      toastEnter: "The seal is broken. Welcome to the underworld.",
      toastExit: "The surface takes you back.",
    },
  },

  projectPage: {
    ogEyebrow: "case study",
    back: "Back",
    repo: "Repository",
    demo: "Live demo",
    decisionsEyebrow: "decision log",
    decisionsTitle: "Decisions that shaped the project.",
    decisionsDescription:
      "What I picked, what I dropped along with it, and the price that came attached.",
    chose: "chose",
    instead: "instead of",
    because: "because",
    cost: "cost",
    translationNotice:
      "The decision log and summary above are in English. The long-form write-up below is still in Portuguese.",
  },
} satisfies Dictionary;
