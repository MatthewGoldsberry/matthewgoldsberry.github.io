/**
 * Site configuration and the landing page's structured copy.
 *
 * This is the half of the old `zensical.toml` plus `index.md` frontmatter that
 * is configuration rather than prose: identity, navigation, and the short
 * structured blocks (stats, current roles, skills) that render as components
 * rather than as paragraphs. Long-form writing lives in `src/content/`.
 *
 * It is TypeScript rather than YAML so that everything referencing it — the
 * header, the footer, the hero, the skills grid — is checked against it. A
 * renamed nav entry or a dropped field is a type error at build time.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "mail" | "file";
}

export const site = {
  name: "Matthew Goldsberry",
  title: "Matthew Goldsberry",
  description:
    "Computer Science BS/MS '27 at the University of Cincinnati — flight software, developer tooling, and multimodal machine learning.",
  url: "https://matthewgoldsberry.github.io/",
  email: "goldsbme@mail.uc.edu",
  resume: "/assets/media/Goldsberry_Matthew_Resume_2026.pdf",
} as const;

export const nav: readonly NavItem[] = [
  { label: "Projects", href: "/projects/" },
  { label: "Experience", href: "/experience/" },
  { label: "Research", href: "/research/" },
  { label: "Resume", href: "/resume/" },
];

export const socials: readonly SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/MatthewGoldsberry",
    icon: "github",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/matthew-goldsberry/",
    icon: "linkedin",
  },
  { label: "Email", href: `mailto:${site.email}`, icon: "mail" },
  { label: "Resume", href: site.resume, icon: "file" },
];

/**
 * The hero.
 *
 * Its job is the first screen of a hiring read: who, what, where, whether he is
 * available, and where to go next. It is sized to its content, not to the
 * viewport — the proof strip below it should be breaking the fold, because the
 * numbers are the argument and a full-height masthead is what kept them off
 * screen.
 */
export const hero = {
  lede:
    "I build software across the stack - agentic backend services, satellite flight computers " +
    "and ground stations, and data visualizations - much of it for systems that run unattended. " +
    "I'm an intern at Tenet3, lead the On-Board Computer team at UC CubeCats, and research " +
    "multimodal LLMs.",
  photo: "/assets/media/profile.jpg",
  photoAlt: "Matthew Goldsberry",

  /**
   * Two rows, no more: the plate is 200px wide and these are the two facts a
   * hiring reader checks straight after the name. `led` lights the status dot.
   */
  plate: [
    { label: "Based", value: "Cincinnati, OH" },
    // Kept short enough to hold one line inside the plate — the closing contact
    // band is where "internship in systems / ML / flight software" is spelled out.
    { label: "Status", value: "Open to summer 2027", led: true },
  ],

  /**
   * One compact line under the hero: employer, research, graduation. Above the
   * fold because these are what someone checks before they read anything else,
   * and on one line because each entry is three or four words — the detail lives
   * in "Currently" further down the page.
   */
  standing: [
    "Researcher · CincyNLP",
    "Platform Services Intern · Tenet3",
    "BS/MS Computer Science · UC '27",
  ],

  actions: [
    { label: "Projects", href: "/projects/", primary: true },
    { label: "Resume", href: "/resume/" },
    { label: "GitHub", href: "https://github.com/MatthewGoldsberry" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/matthew-goldsberry/",
    },
    { label: "Email", href: "mailto:goldsbme@mail.uc.edu" },
  ],
} as const;

/** The proof strip. Highest-value real estate on the homepage. */
export const stats = [
  { value: "20 hr", accent: "6 s", label: "Parser rewrite · Tenet3" },
  { value: "~30", label: "Engineers on my tooling" },
  { value: "1", label: "Satellite in orbit · CubeCats" },
  { value: "3.90", label: "GPA · BS/MS 2027" },
] as const;

/** Current roles, in the order someone would want them. */
export const current = [
  {
    org: "Tenet3",
    role: "Advanced Capabilities Intern",
    meta: "Dayton, OH · May 2025 – present",
    desc:
      "Data conversion and developer tooling: the parser rewrite above, a proof of " +
      "concept taken to production for SaaS deployment, and an internal dev-container " +
      "package around thirty engineers build on.",
  },
  {
    org: "UC CubeCats",
    role: "On-Board Computer Team Lead",
    meta: "University of Cincinnati · Aug 2024 – present",
    desc:
      "Leading OBC architecture and flight software for HABSat-1, plus ground station " +
      "telemetry and the sensor drivers flying on LEOPARDSat-1.",
  },
  {
    org: "CincyNLP",
    role: "M.S. thesis researcher",
    meta: "University of Cincinnati · Through spring 2027",
    desc:
      "Steering multimodal large language models — controlling what a model that reads " +
      "images as well as text attends to, and what it says about them.",
  },
] as const;

export const skills = [
  {
    group: "Languages",
    items: [
      "Python",
      "C / C++",
      "TypeScript",
      "JavaScript",
      "Java",
      "Assembly",
    ],
  },
  {
    group: "Systems & cloud",
    items: ["Git", "CI/CD", "Docker", "AWS", "Azure", "GCP", "GitLab"],
  },
  {
    group: "Data & ML",
    items: [
      "Pandas",
      "D3.js",
      "Reinforcement learning",
      "NLP",
      "Multimodal LLMs",
      "Databricks",
      "Snowflake",
    ],
  },
  {
    group: "Embedded & flight",
    items: [
      "Embedded C",
      "Flight software",
      "Sensor drivers",
      "Telemetry",
      "Hardware test",
    ],
  },
] as const;
