import type { MetadataRoute } from "next";
import { projectsData } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.waseemakram.dev";
  const lastModified = new Date();

  const projectRoutes: MetadataRoute.Sitemap = projectsData.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...projectRoutes,
  ];
}
