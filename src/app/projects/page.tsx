import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProjectsShowcase from "@/components/projects/ProjectsShowcase";
import { projectsData } from "@/data/projects";

const pageUrl = "https://www.waseemakram.dev/projects";

export const metadata: Metadata = {
  title: "Projects & Case Studies",
  description:
    "Explore 4 selected builds by Waseem Akram — Azad Concrete ERP, Monivo, Veyra Studio, and Avenor.",
  alternates: { canonical: pageUrl },
  openGraph: {
    type: "website",
    url: pageUrl,
    title: "Projects & Case Studies — Waseem Akram",
    description:
      "Four selected ERP, SaaS, agency, and architectural digital platforms built with Next.js, TypeScript, PostgreSQL, and GSAP.",
    images: [
      {
        url: projectsData[0].coverImage,
        width: 1200,
        height: 750,
        alt: projectsData[0].coverAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects & Case Studies — Waseem Akram",
    description:
      "4 selected production builds and interactive case studies across ERP, SaaS, and digital studios.",
    images: [projectsData[0].coverImage],
  },
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${pageUrl}#collection`,
      url: pageUrl,
      name: "Projects & Case Studies — Waseem Akram",
      description:
        "Selected portfolio of full-stack ERP software, B2B SaaS platforms, and studio websites architected by Waseem Akram.",
      isPartOf: { "@id": "https://www.waseemakram.dev/#website" },
      author: { "@id": "https://www.waseemakram.dev/#person" },
      mainEntity: { "@id": `${pageUrl}#itemlist` },
    },
    {
      "@type": "ItemList",
      "@id": `${pageUrl}#itemlist`,
      numberOfItems: projectsData.length,
      itemListElement: projectsData.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://www.waseemakram.dev/projects/${project.slug}`,
        name: project.name,
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.waseemakram.dev/" },
        { "@type": "ListItem", position: 2, name: "Projects", item: pageUrl },
      ],
    },
  ],
};

export default function ProjectsPage() {
  return (
    <div className="projects-shell" style={{ background: "#051F20" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <Navbar />
      <main style={{ width: "100%", margin: 0, padding: 0 }}>
        <ProjectsShowcase />
      </main>
      <Footer />
    </div>
  );
}

