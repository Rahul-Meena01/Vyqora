const now = Date.now();

export const DEFAULTS = [
  {
    id: "welcome",
    title: "Welcome to KnowledgeOS",
    content:
      "# Welcome to KnowledgeOS\n\nYour offline-first second brain that lives entirely in your browser.\n\nSee [[React Notes]] and [[Daily Log]].\n\n#guide #meta",
    tags: ["guide", "meta"],
    created: now - 1000 * 60 * 60 * 24 * 4,
    updated: now - 1000 * 60 * 90,
  },
  {
    id: "react-notes",
    title: "React Notes",
    content:
      "# React Notes\n\nHooks are coordination primitives, not magic.\n\nLinks: [[Welcome to KnowledgeOS]] and [[JavaScript Patterns]].\n\n#react #frontend #programming",
    tags: ["react", "frontend", "programming"],
    created: now - 1000 * 60 * 60 * 24 * 3,
    updated: now - 1000 * 60 * 60 * 6,
  },
  {
    id: "daily-log",
    title: "Daily Log",
    content:
      "# Daily Log\n\nReviewed [[React Notes]] and explored [[JavaScript Patterns]].\n\nPotential next move: connect ideas into long-form essays.\n\n#daily #notes",
    tags: ["daily", "notes"],
    created: now - 1000 * 60 * 60 * 24 * 2,
    updated: now - 1000 * 60 * 60 * 2,
  },
  {
    id: "js-patterns",
    title: "JavaScript Patterns",
    content:
      "# JavaScript Patterns\n\n- Closures for private state\n- Pure functions for reliability\n- Composition over inheritance\n\nSee [[React Notes]] for practical hooks examples.\n\n#javascript #patterns",
    tags: ["javascript", "patterns"],
    created: now - 1000 * 60 * 60 * 24 * 7,
    updated: now - 1000 * 60 * 60 * 24,
  },
];
