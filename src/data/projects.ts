export type ProjectCategoryGroup = "Full-Stack ERP" | "SaaS Platforms" | "Brand & Web";

export interface ProjectSnapshot {
  src: string;
  alt: string;
  title: string;
  caption: string;
}

export interface ProjectCaseStudy {
  slug: string;
  featured: boolean;
  name: string;
  titleLines: [string, string];
  category: string;
  categoryGroup: ProjectCategoryGroup;
  year: string;
  role: string;
  tagline: string;
  summary: string;
  challenge: string;
  solution: string;
  highlights: string[];
  stack: string[];
  metrics: { label: string; value: string }[];
  coverImage: string;
  coverAlt: string;
  snapshots: ProjectSnapshot[];
  schemaType: "SoftwareApplication" | "WebApplication" | "CreativeWork";
  applicationCategory?: string;
}

export const projectCategoryFilters: ("All" | ProjectCategoryGroup)[] = [
  "All",
  "Full-Stack ERP",
  "SaaS Platforms",
  "Brand & Web",
];

const allProjectsData: ProjectCaseStudy[] = [
  {
    slug: "azad-concrete-erp",
    featured: true,
    name: "Azad Concrete ERP",
    titleLines: ["Azad Concrete", "ERP"],
    category: "Full-Stack ERP & Accounting",
    categoryGroup: "Full-Stack ERP",
    year: "2026",
    role: "Lead Full-Stack & Database Architect",
    tagline: "End-to-end precast manufacturing ERP, inventory engine & double-entry ledger.",
    summary:
      "A bespoke cloud-backed manufacturing ERP engineered for Azad Concrete Factory to unify raw material intake, concrete slab and girder production costing, finished stock tracking, gatepass invoicing, customer receivables, payroll, and cash/bank accounting.",
    challenge:
      "Factory operations relied on disconnected paper registers for raw aggregates (Saria, Cement, Gitian, Bajri, Rait), curing yields, dealer credit balances, and daily gatepasses — making batch margins and cash reconciliation slow and error-prone.",
    solution:
      "Architected a unified Next.js 16 and PostgreSQL workspace featuring automated bill-of-materials deduction per casting batch, real-time finished goods valuation, PDF gatepass generation, double-entry journal postings, and granular RBAC workspace permissions.",
    highlights: [
      "Automated BOM material deduction across Saria, Cement, Gitian, Bajri, and Rait per production run",
      "Real-time finished stock ledger separating good output, opening pending units, and shrinkage/damage",
      "Gatepass & invoice engine with downloadable print-ready PDFs powered by pdf-lib",
      "Double-entry Cash & Bank accounting ledger with transfers, dealer settlements, and expense tracking",
      "Multi-role authentication with hashed session cookies and workspace-level permission gates",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "PostgreSQL", "Tailwind CSS v4", "pdf-lib", "RBAC Auth"],
    metrics: [
      { label: "Core Modules", value: "10+ Integrated" },
      { label: "Ledger Integrity", value: "Double-Entry" },
      { label: "Document Engine", value: "Automated PDF" },
    ],
    coverImage: "/images/projects-showcase/azad-concrete-erp/01-azad-concrete-erp-dashboard.webp",
    coverAlt: "Azad Concrete ERP dark-themed factory operations dashboard showing inventory metrics and production chart",
    schemaType: "SoftwareApplication",
    applicationCategory: "BusinessApplication",
    snapshots: [
      {
        src: "/images/projects-showcase/azad-concrete-erp/01-azad-concrete-erp-dashboard.webp",
        alt: "Azad Concrete ERP Factory Dashboard with live KPIs and production chart",
        title: "Factory Operations Dashboard",
        caption: "Live overview of sellable slab/girder inventory, 7-day production output, and raw material stock levels.",
      },
      {
        src: "/images/projects-showcase/azad-concrete-erp/02-azad-concrete-erp-stocks.webp",
        alt: "Finished goods inventory grid grouped by slab and girder dimensions",
        title: "Finished Goods & Size Matrix",
        caption: "Dimension-indexed stock management supporting custom slab/girder recipes, pending openings, and pricing.",
      },
      {
        src: "/images/projects-showcase/azad-concrete-erp/03-azad-concrete-erp-production.webp",
        alt: "Production openings dashboard displayed on an industrial tablet",
        title: "Production Openings",
        caption: "Slab batches, opening dates, and inspection results in one view.",
      },
      {
        src: "/images/projects-showcase/azad-concrete-erp/04-azad-concrete-erp-gatepass.webp",
        alt: "Gatepass and invoice register on a desktop display",
        title: "Gatepass & Invoices",
        caption: "Customer invoices and finished goods dispatches in one register.",
      },
      {
        src: "/images/projects-showcase/azad-concrete-erp/05-azad-concrete-erp-accounts.webp",
        alt: "Accounts dashboard with cash and bank balances on a laptop",
        title: "Cash, Bank & Payment Ledger",
        caption: "Cash and bank balances with a searchable payment history.",
      },
    ],
  },
  {
    slug: "relayvo",
    featured: true,
    name: "Relayvo",
    titleLines: ["Relayvo", "SaaS"],
    category: "SaaS Operations Platform",
    categoryGroup: "SaaS Platforms",
    year: "2026",
    role: "Full-Stack Product Engineer & Motion Architect",
    tagline: "Multi-team workflow SaaS platform connecting handoffs, analytics, and operational clarity.",
    summary:
      "A high-conversion B2B SaaS platform built for modern distributed teams to coordinate tasks, cross-functional handoffs, live velocity analytics, and transparent subscription workflows inside a responsive, motion-choreographed interface.",
    challenge:
      "Growing SaaS products often suffer from stiff, generic landing pages that fail to visualize how product workflows actually reduce handoff friction across engineering, product, and client operations.",
    solution:
      "Built an interactive Next.js 16 and GSAP product experience pairing live workspace dashboard previews with smooth Lenis scrolling, modular feature storytelling, and clear pricing architecture.",
    highlights: [
      "Interactive product dashboard mockups embedded cleanly into responsive grid sections",
      "Hardware-accelerated GSAP scroll choreography synchronized with Lenis smooth scrolling",
      "Modular multi-page SaaS routing across features, pricing, blog insights, and demo capture",
      "Accessible, reduced-motion-safe interactive controls and semantic landmark structure",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "GSAP 3.15", "Lenis", "Responsive CSS Grid"],
    metrics: [
      { label: "Frame Budget", value: "60fps GSAP" },
      { label: "Architecture", value: "Multi-Route App" },
      { label: "Asset Optimization", value: "WebP + Fonts" },
    ],
    coverImage:
      "https://res.cloudinary.com/eckkgw2a/image/upload/v1794470049/waseem-akram/projects/relayvo/01-hero.webp",
    coverAlt: "Relayvo SaaS hero showcasing clean gradient backdrop and embedded workspace UI cards",
    schemaType: "WebApplication",
    applicationCategory: "ProductivityApplication",
    snapshots: [
      {
        src: "https://res.cloudinary.com/eckkgw2a/image/upload/v1794470049/waseem-akram/projects/relayvo/01-hero.webp",
        alt: "Relayvo SaaS hero banner with workspace preview",
        title: "Hero & Workspace Preview",
        caption: "Conversion-focused SaaS opening framing core value proposition alongside a live dashboard preview.",
      },
      {
        src: "https://res.cloudinary.com/eckkgw2a/image/upload/v1794470057/waseem-akram/projects/relayvo/02-features.webp",
        alt: "Relayvo feature cards highlighting cross-team handoffs",
        title: "Collaborative Feature Matrix",
        caption: "Structured feature breakdown detailing async handoffs, status visibility, and shared timelines.",
      },
      {
        src: "https://res.cloudinary.com/eckkgw2a/image/upload/v1794470064/waseem-akram/projects/relayvo/03-product.webp",
        alt: "Relayvo interactive business solutions interface with analytics chart and team members",
        title: "Workspace Telemetry View",
        caption: "Live UI system displaying team velocity graphs, financial indicators, and member assignments.",
      },
      {
        src: "https://res.cloudinary.com/eckkgw2a/image/upload/v1794470072/waseem-akram/projects/relayvo/04-pricing.webp",
        alt: "Relayvo SaaS pricing tiers view",
        title: "Transparent Pricing Architecture",
        caption: "Clean SaaS tier comparison engineered for fast plan comprehension and clear upgrade paths.",
      },
      {
        src: "https://res.cloudinary.com/eckkgw2a/image/upload/v1794470081/waseem-akram/projects/relayvo/05-workflow.webp",
        alt: "Relayvo workflow showcase screen",
        title: "Operational Workflow Flow",
        caption: "Visual walkthrough illustrating how approvals, tasks, and updates move cleanly between teams.",
      },
    ],
  },
  {
    slug: "monivo",
    featured: true,
    name: "Monivo",
    titleLines: ["Monivo", "Workspace"],
    category: "Collaborative Work SaaS",
    categoryGroup: "SaaS Platforms",
    year: "2026",
    role: "UI Systems & Full-Stack Frontend Developer",
    tagline: "Dark-mode collaborative SaaS workspace engineered for calm execution and product clarity.",
    summary:
      "A refined SaaS web platform combining low-glare dark surfaces, bespoke typographic pairing (sans + italic serif display), ambient depth lighting, and structured feature/pricing views tailored for modern productivity software.",
    challenge:
      "Most B2B workspace tools feel visually noisy and fatiguing. Monivo needed a calm, executive aesthetic that communicates focus while still demonstrating rich workflow depth.",
    solution:
      "Crafted a dark architectural design system on Next.js 16 and React 19 with layered radial spotlights, micro-interactive button overlays, GSAP entrance sequencing, and responsive multi-breakpoint layouts.",
    highlights: [
      "Precision dark-surface palette pairing high-contrast typography with subtle spotlight depth",
      "Editorial mixed-type headlines blending geometric sans and italic display accents",
      "Seamless Lenis + GSAP scroll reveals without layout shift (CLS 0)",
      "Dedicated pricing, features, blog, and product showcase routes",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "GSAP", "Lenis", "Design Systems"],
    metrics: [
      { label: "Visual System", value: "Dark Editorial" },
      { label: "Layout Stability", value: "Zero CLS" },
      { label: "Interaction", value: "GSAP + Lenis" },
    ],
    coverImage: "/images/projects-showcase/monivo/01-monivo-home.webp",
    coverAlt: "Monivo dark SaaS product interface hero with radial spotlight and mixed serif typography",
    schemaType: "WebApplication",
    applicationCategory: "BusinessApplication",
    snapshots: [
      {
        src: "/images/projects-showcase/monivo/01-monivo-home.webp",
        alt: "Monivo hero interface on dark slate surface",
        title: "Calm Workspace Hero",
        caption: "Low-glare dark opening with balanced typographic hierarchy and immediate product CTA.",
      },
      {
        src: "/images/projects-showcase/monivo/02-monivo-product.webp",
        alt: "Monivo product page displayed on a laptop",
        title: "Product Overview",
        caption: "A focused introduction to the connected workspace.",
      },
      {
        src: "/images/projects-showcase/monivo/03-monivo-features.webp",
        alt: "Monivo modular product capabilities screen",
        title: "Modular Workspace System",
        caption: "Structured capability cards organizing team views, routines, and shared status pipelines.",
      },
      {
        src: "/images/projects-showcase/monivo/04-monivo-pricing.webp",
        alt: "Monivo SaaS pricing comparison layout",
        title: "Subscription Tier Grid",
        caption: "Cleanly spaced plan breakdown with clear feature callouts and high-contrast CTA buttons.",
      },
      {
        src: "/images/projects-showcase/monivo/05-monivo-contact-mobile.webp",
        alt: "Monivo mobile contact page on a phone",
        title: "Mobile Contact",
        caption: "A responsive contact experience for smaller screens.",
      },
    ],
  },
  {
    slug: "veyra-studio",
    featured: true,
    name: "Veyra Studio",
    titleLines: ["Veyra", "Studio"],
    category: "Digital Agency Showcase",
    categoryGroup: "Brand & Web",
    year: "2026",
    role: "Creative Technologist & Frontend Architect",
    tagline: "Kinetic typography & multi-route digital agency showcase built for speed and expressive branding.",
    summary:
      "An editorial agency platform crafted for Veyra Studio featuring oversized condensed display typography, script-serif accents, smooth scroll-driven transitions, service methodology breakdowns, and dedicated case-study routes.",
    challenge:
      "Creative agencies need their own web presence to prove craft within the first two seconds — combining bold typographic scale with instant page responsiveness and zero jank across mobile and desktop viewports.",
    solution:
      "Engineered custom Next.js App Router views powered by GSAP timelines and Lenis smooth scroll, pairing crisp neutral surfaces with kinetic text reveals, inline 3D-rendered visual badges, and structured inquiry funnels.",
    highlights: [
      "Oversized editorial headline system mixing condensed uppercase display and script italic",
      "Inline rich media pills embedded cleanly inside display headings",
      "Structured agency workflow across Home, Services, Portfolio, Journal, About, and Contact",
      "Consistent typography scaling from ultra-wide desktop to compact mobile viewports",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "GSAP", "Lenis", "Editorial Typography"],
    metrics: [
      { label: "Route Coverage", value: "7 Core Pages" },
      { label: "Typography Scale", value: "Fluid Clamp" },
      { label: "Motion Engine", value: "GSAP Timelines" },
    ],
    coverImage: "/images/projects-showcase/veyra-studio/01-veyra-studio-hero.png",
    coverAlt: "Veyra Studio bold typographic hero with client wordmarks",
    schemaType: "CreativeWork",
    snapshots: [
      {
        src: "/images/projects-showcase/veyra-studio/01-veyra-studio-hero.png",
        alt: "Veyra Studio typographic hero and client logo strip",
        title: "Kinetic Brand Hero",
        caption: "Monumental condensed typography anchoring brand positioning with curated client marks.",
      },
      {
        src: "/images/projects-showcase/veyra-studio/02-veyra-studio-selected-work.png",
        alt: "Veyra Studio selected work displayed on a screen",
        title: "Selected Work",
        caption: "A selection of brand, website, and digital product concepts.",
      },
      {
        src: "/images/projects-showcase/veyra-studio/03-veyra-studio-services.png",
        alt: "Veyra Studio creative services on a desktop display",
        title: "Creative Services",
        caption: "An editorial introduction to the studio's services.",
      },
      {
        src: "/images/projects-showcase/veyra-studio/04-veyra-studio-studio-process.png",
        alt: "Veyra Studio process displayed on a dark screen",
        title: "Studio Process",
        caption: "The four stages of the studio's project process.",
      },
      {
        src: "/images/projects-showcase/veyra-studio/05-veyra-studio-journal.png",
        alt: "Veyra Studio journal displayed on a tablet",
        title: "Studio Journal",
        caption: "Editorial articles and visual stories from the studio.",
      },
    ],
  },
  {
    slug: "nortera-advisory",
    featured: false,
    name: "Nortera Advisory",
    titleLines: ["Nortera", "Advisory"],
    category: "Financial Advisory Platform",
    categoryGroup: "Brand & Web",
    year: "2026",
    role: "Full-Stack Web Developer & UX Architect",
    tagline: "Editorial wealth & corporate strategy web platform built around clarity, trust, and poise.",
    summary:
      "A bespoke digital flagship for Nortera Advisory featuring deep forest-green brand accents, refined serif typography, structured practice areas (business performance, resource allocation, cash flow clarity), and streamlined consultation booking.",
    challenge:
      "Financial and corporate advisory firms must project institutional credibility and calm authority without falling into sterile stock templates.",
    solution:
      "Delivered a Next.js editorial platform pairing crisp serif headlines and photography cards with thoughtful pacing, interactive service carousels, and clean client onboarding flows.",
    highlights: [
      "Institutional forest-green & off-white palette balancing authority with modern readability",
      "Practice area matrix covering cash flow clarity, performance review, and scenario planning",
      "Smooth GSAP scroll reveals and Lenis navigation tuned for executive audiences",
      "Accessible forms, high-contrast typography, and mobile-first responsive grids",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "GSAP", "Lenis", "Lucide Icons"],
    metrics: [
      { label: "Brand Tone", value: "Editorial Trust" },
      { label: "Core Stack", value: "Next.js + GSAP" },
      { label: "Responsive", value: "Mobile to 4K" },
    ],
    coverImage:
      "https://res.cloudinary.com/eckkgw2a/image/upload/v1794469965/waseem-akram/projects/nortera-advisory/01-hero.webp",
    coverAlt: "Nortera Advisory clean editorial hero with serif headline",
    schemaType: "CreativeWork",
    snapshots: [
      {
        src: "https://res.cloudinary.com/eckkgw2a/image/upload/v1794469965/waseem-akram/projects/nortera-advisory/01-hero.webp",
        alt: "Nortera Advisory opening hero view",
        title: "Advisory Flagship Hero",
        caption: "Measured editorial opening establishing clarity and executive advisory focus.",
      },
      {
        src: "https://res.cloudinary.com/eckkgw2a/image/upload/v1794469974/waseem-akram/projects/nortera-advisory/02-practice.webp",
        alt: "Nortera Advisory services grid combining photography and advisory disciplines",
        title: "Advisory Services Grid",
        caption: "Alternating photography and typographic tiles detailing financial strategy offerings.",
      },
      {
        src: "https://res.cloudinary.com/eckkgw2a/image/upload/v1794469984/waseem-akram/projects/nortera-advisory/03-strategy.webp",
        alt: "Nortera Advisory strategic methodology section",
        title: "Strategic Framework",
        caption: "Structured visual storytelling breaking down long-term capital and operational planning.",
      },
      {
        src: "https://res.cloudinary.com/eckkgw2a/image/upload/v1794469992/waseem-akram/projects/nortera-advisory/04-about.webp",
        alt: "Nortera Advisory leadership and firm profile page",
        title: "Firm Leadership & Ethos",
        caption: "Warm, people-first firm presentation reinforcing long-term client partnerships.",
      },
      {
        src: "https://res.cloudinary.com/eckkgw2a/image/upload/v1794470001/waseem-akram/projects/nortera-advisory/05-contact.webp",
        alt: "Nortera Advisory consultation contact screen",
        title: "Consultation Booking",
        caption: "Distraction-free advisory inquiry screen designed for direct partner outreach.",
      },
    ],
  },
  {
    slug: "avenor",
    featured: false,
    name: "Avenor",
    titleLines: ["Avenor", "Architecture"],
    category: "Architecture & Spatial Web",
    categoryGroup: "Brand & Web",
    year: "2026",
    role: "Lead Frontend Engineer & Motion Designer",
    tagline: "Architectural showcase combining warm terracotta panels, dark galleries, and spatial photography.",
    summary:
      "An atmospheric portfolio platform for architecture and interiors studio Avenor. Built on Next.js with charcoal dark canvases, warm blush/terracotta editorial accents, architectural study pages, and metric-driven studio narratives.",
    challenge:
      "Architectural photography needs generous breathing room, dramatic contrast, and unhurried motion pacing so spatial proportions remain the centerpiece.",
    solution:
      "Built a dual-tone charcoal and warm stone layout system with GSAP transitions, tactile pill CTAs, curated study archives (`/projects/projects-v-1`), and full-bleed photographic framing.",
    highlights: [
      "Charcoal dark-mode gallery sections contrasted with warm terracotta editorial bands",
      "Full-bleed architectural study showcases honoring natural light and proportion",
      "Studio statistics and discipline breakdowns for architecture, interiors, and material studies",
      "Lenis smooth scroll + GSAP reveal choreography tailored to photography viewing",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "GSAP", "Lenis", "Lucide Icons"],
    metrics: [
      { label: "Visual System", value: "Charcoal & Clay" },
      { label: "Studies Index", value: "Curated Grid" },
      { label: "Performance", value: "Optimized WebP" },
    ],
    coverImage: "/images/projects-showcase/avenor/01-avenor-home.png",
    coverAlt: "Avenor glass oceanfront pavilion architectural study above terracotta editorial band",
    schemaType: "CreativeWork",
    snapshots: [
      {
        src: "/images/projects-showcase/avenor/01-avenor-home.png",
        alt: "Avenor coastal architectural study and terracotta narrative panel",
        title: "Architectural Studies Feature",
        caption: "Full-width spatial study photography paired with warm terracotta editorial framing.",
      },
      {
        src: "/images/projects-showcase/avenor/02-avenor-projects.png",
        alt: "Avenor Arcade courtyard study and services band",
        title: "Spatial Courtyard & Services",
        caption: "Layered dark and stone cards transitioning seamlessly into architectural capabilities.",
      },
      {
        src: "/images/projects-showcase/avenor/03-avenor-services.png",
        alt: "Avenor architecture and interiors services on a desktop display",
        title: "Architecture & Interiors Scope",
        caption: "A dark layout introducing architectural services.",
      },
      {
        src: "/images/projects-showcase/avenor/04-avenor-about.png",
        alt: "Avenor studio about page with key studio metrics",
        title: "The Studio Narrative",
        caption: "Studio ethos and a summary of disciplines and material explorations.",
      },
      {
        src: "/images/projects-showcase/avenor/05-avenor-contact-mobile.png",
        alt: "Avenor mobile contact form displayed on a phone",
        title: "Mobile Contact",
        caption: "A responsive enquiry form for prospective projects.",
      },
    ],
  },
  {
    slug: "orvane-studio",
    featured: false,
    name: "Orvane Studio",
    titleLines: ["Orvane", "Studio"],
    category: "Spatial Design Portfolio",
    categoryGroup: "Brand & Web",
    year: "2026",
    role: "Full-Stack Frontend Engineer",
    tagline: "Crisp slate & ice-blue architectural interior showcase built for visual storytelling.",
    summary:
      "A clean, tactile digital portfolio for Orvane Studio exploring residential architecture, interior lighting, service packages, and studio collaboration through refined slate-blue surfaces and fluid GSAP motion.",
    challenge:
      "Presenting interior design work, transparent service scopes, and pricing packages together without breaking the minimalist editorial atmosphere.",
    solution:
      "Created a cohesive slate-and-ice design system on Next.js 16 and React 19 with two-column photographic grids, hair-line typographic dividers, and balanced conversion modules.",
    highlights: [
      "Slate-charcoal and ice-blue accent system built for architectural photography contrast",
      "Side-by-side spatial studies grid with crisp interior & exterior pairings",
      "Clear service breakdown and transparent project package architecture",
      "Smooth client-side route transitions with GSAP and Lenis",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "GSAP", "Lenis", "CSS Architecture"],
    metrics: [
      { label: "Color Direction", value: "Slate & Ice" },
      { label: "Visual Grid", value: "Dual Spatial" },
      { label: "Framework", value: "Next.js 16" },
    ],
    coverImage:
      "https://res.cloudinary.com/eckkgw2a/image/upload/v1794470011/waseem-akram/projects/orvane-studio/01-hero.webp",
    coverAlt: "Orvane Studio opening showcase with slate theme and interior design preview",
    schemaType: "CreativeWork",
    snapshots: [
      {
        src: "https://res.cloudinary.com/eckkgw2a/image/upload/v1794470011/waseem-akram/projects/orvane-studio/01-hero.webp",
        alt: "Orvane Studio hero presentation",
        title: "Slate Editorial Opening",
        caption: "Refined architectural hero setting the tone with crisp typography and atmospheric lighting.",
      },
      {
        src: "https://res.cloudinary.com/eckkgw2a/image/upload/v1794470019/waseem-akram/projects/orvane-studio/02-portfolio.webp",
        alt: "Orvane Studio side-by-side exterior and interior study cards",
        title: "Studio Studies Grid",
        caption: "Dual-column architectural and interior showcase framed on deep slate backgrounds.",
      },
      {
        src: "https://res.cloudinary.com/eckkgw2a/image/upload/v1794470027/waseem-akram/projects/orvane-studio/03-services.webp",
        alt: "Orvane Studio services capabilities",
        title: "Interior & Spatial Services",
        caption: "Structured discipline overview detailing concept design, lighting, and material curation.",
      },
      {
        src: "https://res.cloudinary.com/eckkgw2a/image/upload/v1794470030/waseem-akram/projects/orvane-studio/04-pricing.webp",
        alt: "Orvane Studio engagement packages",
        title: "Engagement Packages",
        caption: "Clear, client-friendly scope and tier presentation built for confident project scoping.",
      },
      {
        src: "https://res.cloudinary.com/eckkgw2a/image/upload/v1794470038/waseem-akram/projects/orvane-studio/05-about.webp",
        alt: "Orvane Studio story and design ethos",
        title: "Studio Story & Ethos",
        caption: "Architectural perspective highlighting craftsmanship, proportion, and natural atmosphere.",
      },
    ],
  },
];

const visibleProjectSlugs = new Set([
  "azad-concrete-erp",
  "monivo",
  "veyra-studio",
  "avenor",
]);

export const projectsData = allProjectsData.filter((project) =>
  visibleProjectSlugs.has(project.slug),
);

export const featuredProjects = projectsData.filter((project) => project.featured);

export function getProjectBySlug(slug: string): ProjectCaseStudy | undefined {
  return projectsData.find((project) => project.slug === slug);
}

