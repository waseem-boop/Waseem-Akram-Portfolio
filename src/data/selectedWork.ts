import { featuredProjects } from "@/data/projects";

export const selectedWork = {
  eyebrow: "Portfolio",
  heading: "Latest work",
  items: featuredProjects.map((project) => ({
    slug: project.slug,
    title: project.titleLines,
    category: project.category,
    image: project.coverImage,
    alt: project.coverAlt,
    href: `/projects/${project.slug}`,
  })),
};
