import { siteConfig } from "@/data/siteConfig";

export const serviceShowcase = {
  heading: "Services",
  introduction:
    "I turn ambitious ideas into high-performing websites, scalable software and thoughtful mobile experiences.",
  marquee: [
    "From idea to launch",
    "Let's build your next chapter",
    "Websites, software & mobile apps",
    "Made for your business",
  ],
  items: [
    {
      id: "websites",
      title: "Websites",
      description:
        "Fast, responsive websites and e-commerce experiences. From custom interfaces to product pages and checkout, built around your brand.",
      image: "/images/services/website-interface.svg",
      subject: "Web Development and E-commerce inquiry",
    },
    {
      id: "saas",
      title: "SaaS platforms",
      description:
        "Custom dashboards, connected systems and scalable software. Thoughtful full-stack development to take your product from MVP to launch.",
      image: "/images/services/saas-dashboard.svg",
      subject: "SaaS Platforms inquiry",
    },
    {
      id: "mobile",
      title: "Mobile apps",
      description:
        "Intuitive mobile interfaces and cross-platform apps. Clear user journeys and considered interactions, built for iOS and Android.",
      image: "/images/services/mobile-interface.svg",
      subject: "Mobile Apps inquiry",
    },
  ].map((item) => ({
    ...item,
    href: `mailto:${siteConfig.email}?subject=${encodeURIComponent(item.subject)}`,
  })),
};
