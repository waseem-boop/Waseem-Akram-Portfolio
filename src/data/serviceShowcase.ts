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
      image:
        "https://res.cloudinary.com/eckkgw2a/image/upload/v1794393006/waseem-akram/services/web-sculpture.webp",
      imageWidth: 1050,
      imageHeight: 1530,
      subject: "Web Development and E-commerce inquiry",
    },
    {
      id: "saas",
      title: "SaaS platforms",
      description:
        "Custom dashboards, connected systems and scalable software. Thoughtful full-stack development to take your product from MVP to launch.",
      image:
        "https://res.cloudinary.com/eckkgw2a/image/upload/v1794393006/waseem-akram/services/saas-sculpture.webp",
      imageWidth: 691,
      imageHeight: 713,
      subject: "SaaS Platforms inquiry",
    },
    {
      id: "mobile",
      title: "Mobile apps",
      description:
        "Intuitive mobile interfaces and cross-platform apps. Clear user journeys and considered interactions, built for iOS and Android.",
      image:
        "https://res.cloudinary.com/eckkgw2a/image/upload/v1794393006/waseem-akram/services/app-sculpture.webp",
      imageWidth: 678,
      imageHeight: 666,
      subject: "Mobile Apps inquiry",
    },
  ].map((item) => ({
    ...item,
    href: `mailto:${siteConfig.email}?subject=${encodeURIComponent(item.subject)}`,
  })),
};
