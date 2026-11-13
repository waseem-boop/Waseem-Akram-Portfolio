import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProjectGallery from "@/components/projects/ProjectGallery";
import PortfolioButton from "@/components/ui/PortfolioButton";
import { getProjectBySlug, projectsData } from "@/data/projects";
import { siteConfig } from "@/data/siteConfig";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projectsData.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  const pageUrl = `https://www.waseemakram.dev/projects/${project.slug}`;
  return {
    title: `${project.name} — ${project.category}`,
    description: project.summary,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: "article",
      url: pageUrl,
      title: `${project.name} Case Study — Waseem Akram`,
      description: project.tagline,
      images: [
        {
          url: project.coverImage,
          width: 1200,
          height: 750,
          alt: project.coverAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} — Waseem Akram`,
      description: project.tagline,
      images: [project.coverImage],
    },
  };
}

export default async function ProjectCaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const index = projectsData.findIndex((item) => item.slug === project.slug);
  const prevProject = index > 0 ? projectsData[index - 1] : null;
  const nextProject =
    index < projectsData.length - 1 ? projectsData[index + 1] : null;

  const pageUrl = `https://www.waseemakram.dev/projects/${project.slug}`;
  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": project.schemaType,
        "@id": `${pageUrl}#work`,
        name: project.name,
        headline: project.tagline,
        description: project.summary,
        url: pageUrl,
        image: project.snapshots.map((snap) => snap.src),
        dateCreated: project.year,
        ...(project.applicationCategory
          ? { applicationCategory: project.applicationCategory, operatingSystem: "Web" }
          : {}),
        keywords: project.stack.join(", "),
        author: { "@id": "https://www.waseemakram.dev/#person" },
        creator: { "@id": "https://www.waseemakram.dev/#person" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.waseemakram.dev/" },
          { "@type": "ListItem", position: 2, name: "Projects", item: "https://www.waseemakram.dev/projects" },
          { "@type": "ListItem", position: 3, name: project.name, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <div className="projects-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <Navbar />
      <main className="case-main">
        <nav className="projects-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/projects">Projects</Link>
          <span aria-hidden="true">/</span>
          <span>{project.name}</span>
        </nav>

        <header className="case-header">
          <div className="case-header-copy">
            <p className="projects-eyebrow">{project.category}</p>
            <h1>{project.name}</h1>
            <p>{project.tagline}</p>
          </div>
          <aside className="case-meta-card" aria-label="Project details">
            <div className="case-meta-row">
              <span className="case-meta-label">Role</span>
              <span className="case-meta-value">{project.role}</span>
            </div>
            <div className="case-meta-row">
              <span className="case-meta-label">Category</span>
              <span className="case-meta-value">{project.categoryGroup}</span>
            </div>
            <div className="case-meta-row">
              <span className="case-meta-label">Year</span>
              <span className="case-meta-value">{project.year}</span>
            </div>
            <div className="case-meta-row">
              <span className="case-meta-label">Snapshots</span>
              <span className="case-meta-value">{project.snapshots.length} Views</span>
            </div>
          </aside>
        </header>

        <div className="case-metrics-strip">
          {project.metrics.map((metric) => (
            <div key={metric.label} className="case-metric-tile">
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </div>

        <figure className="case-hero-frame">
          <div className="case-browser-chrome" aria-hidden="true">
            <span className="case-browser-dot" />
            <span className="case-browser-dot" />
            <span className="case-browser-dot" />
            <span className="case-browser-title">{project.name} · Production Interface</span>
          </div>
          <Image
            src={project.coverImage}
            alt={project.coverAlt}
            width={1200}
            height={750}
            priority
            sizes="(max-width: 1320px) 100vw, 1272px"
          />
        </figure>

        <div className="case-story-grid">
          <section className="case-panel case-panel--wide">
            <h2>Project Overview</h2>
            <p>{project.summary}</p>
          </section>

          <section className="case-panel">
            <h2>The Challenge</h2>
            <p>{project.challenge}</p>
          </section>

          <section className="case-panel">
            <h2>Architecture &amp; Solution</h2>
            <p>{project.solution}</p>
          </section>

          <section className="case-panel">
            <h2>Key Engineering Highlights</h2>
            <ul className="case-highlights">
              {project.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="case-panel">
            <h2>Technology Stack</h2>
            <div className="project-stack-pills">
              {project.stack.map((tech) => (
                <span key={tech} className="project-stack-pill">
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </div>

        <ProjectGallery projectName={project.name} snapshots={project.snapshots} />

        <section className="case-cta-banner" aria-label="Discuss a similar project">
          <div>
            <h2>Need something like {project.name}?</h2>
            <p>
              I help founders and teams design and ship scalable ERPs, SaaS products, and high-craft web platforms.
            </p>
          </div>
          <PortfolioButton
            href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(`Similar to ${project.name}`)}`}
            label="Discuss your build"
            variant="secondary"
          />
        </section>

        <nav className="case-pager" aria-label="Adjacent case studies">
          {prevProject ? (
            <Link href={`/projects/${prevProject.slug}`} className="case-pager-link">
              <span className="case-pager-dir">
                <ArrowLeft size={14} /> Previous project
              </span>
              <span className="case-pager-name">{prevProject.name}</span>
            </Link>
          ) : (
            <Link href="/projects" className="case-pager-link">
              <span className="case-pager-dir">
                <ArrowLeft size={14} /> Back to archive
              </span>
              <span className="case-pager-name">All {projectsData.length} Projects</span>
            </Link>
          )}
          {nextProject ? (
            <Link href={`/projects/${nextProject.slug}`} className="case-pager-link case-pager-link--next">
              <span className="case-pager-dir">
                Next project <ArrowRight size={14} />
              </span>
              <span className="case-pager-name">{nextProject.name}</span>
            </Link>
          ) : (
            <Link href="/projects" className="case-pager-link case-pager-link--next">
              <span className="case-pager-dir">
                View archive <ArrowRight size={14} />
              </span>
              <span className="case-pager-name">All {projectsData.length} Projects</span>
            </Link>
          )}
        </nav>
      </main>
      <Footer />
    </div>
  );
}

