import { siteConfig } from "@/data/siteConfig";

const inquiry = (service: string) =>
  `mailto:${siteConfig.email}?subject=${encodeURIComponent(`${service} inquiry`)}`;

// These reference product shots illustrate the service, not client-work claims.
export const services = {
  heading: "Services",
  caption: "Design / Build / Launch",
  items: [
    {
      id: "web-development",
      lines: ["Web", "Development"],
      name: "Web Development",
      detail: "Fast, responsive websites & digital experiences",
      tag: "Design to development",
      platform: "Next.js / React",
      cover: "/images/services/web-cover.jpg",
      stage: "/images/services/web-screen.jpg",
      screens: [
        "/images/services/web-screen.jpg",
        "/images/services/web-detail.jpg",
      ],
      slides: [
        "/images/services/web-cover.jpg",
        "/images/services/web-detail.jpg",
      ],
      alt: "Responsive website example across mobile and desktop layouts",
      href: inquiry("Web Development"),
    },
    {
      id: "saas-platforms",
      lines: ["SaaS", "Platforms"],
      name: "SaaS Platforms",
      detail: "Custom dashboards, products & scalable software",
      tag: "From MVP to launch",
      platform: "Full-stack / Cloud",
      cover: "/images/projects/frame.webp",
      stage: "/images/projects/frame.webp",
      screens: [
        "/images/projects/frame-hover.webp",
        "/images/projects/frame.webp",
      ],
      slides: [
        "/images/projects/frame-hover.webp",
        "/images/projects/frame.webp",
      ],
      alt: "SaaS workspace interface and software product website example",
      href: inquiry("SaaS Platforms"),
    },
    {
      id: "mobile-apps",
      lines: ["Mobile", "Apps"],
      name: "Mobile Apps",
      detail: "Thoughtful mobile interfaces & app development",
      tag: "iOS & Android",
      platform: "Mobile / Product UI",
      cover: "/images/services/app-cover.jpg",
      stage: "/images/services/app-stage.jpg",
      screens: [
        "/images/services/app-screen.jpg",
        "/images/services/app-detail.jpg",
      ],
      slides: [
        "/images/services/app-screen.jpg",
        "/images/services/app-detail.jpg",
      ],
      alt: "Mobile app interface example with booking and rewards screens",
      href: inquiry("Mobile Apps"),
    },
    {
      id: "e-commerce",
      lines: ["E-commerce"],
      name: "E-commerce",
      detail: "Custom storefronts, product pages & checkout flows",
      tag: "Built for your brand",
      platform: "Shopify / Commerce",
      cover: "/images/services/commerce-cover.jpg",
      stage: "/images/services/commerce-screen.jpg",
      screens: [
        "/images/services/commerce-screen.jpg",
        "/images/services/commerce-detail.jpg",
      ],
      slides: [
        "/images/services/commerce-cover.jpg",
        "/images/services/commerce-detail.jpg",
      ],
      alt: "E-commerce storefront example showing product discovery and shopping UI",
      href: inquiry("E-commerce"),
    },
  ],
};

export type Service = (typeof services.items)[number];
