export const siteConfig = {
  name: "Waseem Akram",
  description:
    "Waseem Akram, full-stack developer and SaaS architect. Building modern web applications, scalable software and thoughtful digital experiences.",
  email: "info@waseemakram.dev",
  brand: { firstLine: "WASEEM", secondLine: "AKRAM" },
  portrait:
    "https://res.cloudinary.com/eckkgw2a/image/upload/v1794393004/waseem-akram/hero/portrait-cutout.webp",
  heroBackground:
    "https://res.cloudinary.com/eckkgw2a/image/upload/v1794392939/waseem-akram/hero/hero-bg.webp",
  hero: {
    firstName: "WASEEM",
    lastName: "AKRAM",
    descriptor: ["Full-stack developer", "& SaaS architect"],
    roles: [
      { firstLine: "/  Web & app", secondLine: "    developer" },
      { firstLine: "/  SaaS", secondLine: "    architect" },
    ],
  },
  statement: {
    paragraphs: [
      "I design and build modern websites, scalable SaaS platforms, and digital experiences that work as hard as they look.",
      "From a first idea to a polished launch, I bring design and development together to turn complex challenges into clear, reliable, and thoughtful digital products.",
    ],
  },
  navigation: [
    { label: "About", href: "#about" },
    {
      label: "Projects",
      href: "#projects",
    },
    { label: "Stack", href: "#stack" },
    { label: "GitHub", href: "https://github.com/waseemakram-dev" },
  ],
  inquiry: "Work inquiry",
  hireLabel: "HIRE ME",
  ripple: {
    radius: 0.05,
    softness: 0.5,
    strength: 0.2,
    decay: 0.85,
    displacement: 0.02,
    centerFade: 0.06,
    dispersion: 0.08,
    clickSpeed: 1.6,
  },
} as const;
