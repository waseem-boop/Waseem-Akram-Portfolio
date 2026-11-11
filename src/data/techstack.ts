import { siteConfig } from "@/data/siteConfig";

export const techStackData = {
  eyebrow: "TECH STACK / 05",
  title: "TECH STACK",
  description:
    "Core languages, frameworks, databases, and cloud tools I use to architect and ship scalable web apps and digital products.",
  ctaText: "Get in touch",
  ctaHref: `mailto:${siteConfig.email}`,
  rows: [
    // Row 1: Frontend & Full-Stack Core (9 items)
    [
      { id: "html5", label: "HTML5" },
      { id: "css", label: "CSS3" },
      { id: "js", label: "JavaScript" },
      { id: "typescript", label: "TypeScript" },
      { id: "react", label: "React" },
      { id: "nextjs", label: "Next.js" },
      { id: "tailwindcss", label: "Tailwind CSS" },
      { id: "reactnative", label: "React Native" },
      { id: "nodejs", label: "Node.js" },
    ],
    // Row 2: Backend, APIs, Databases & Cloud/DevOps (9 items)
    [
      { id: "nestjs", label: "NestJS" },
      { id: "express", label: "Express" },
      { id: "graphql", label: "GraphQL" },
      { id: "postgresql", label: "PostgreSQL" },
      { id: "mongodb", label: "MongoDB" },
      { id: "mysqli", label: "MySQL" },
      { id: "firebase", label: "Firebase" },
      { id: "supabase", label: "Supabase" },
      { id: "docker", label: "Docker" },
    ],
  ],
} as const;
