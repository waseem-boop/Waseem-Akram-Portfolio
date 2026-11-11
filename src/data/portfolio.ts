// Reference projects are kept separate from Waseem's identity and can be replaced here.
const reference = "https://www.awakeagency.dev/projects";

export const portfolio = {
  heading: "Our projects",
  featured: [
    {
      slug: "mihailove",
      title: "Mihailove",
      discipline: "Development",
      alt: "Mihailove, jewellery site",
      x: 8.8889,
      y: 0,
      parallax: 14,
    },
    {
      slug: "frame",
      title: "Frame",
      discipline: "Development",
      alt: "Frame, product site",
      x: 66.1806,
      y: 23.9583,
      parallax: -10,
    },
    {
      slug: "portfolio-ventures",
      title: "Portfolio Ventures",
      discipline: "Branding",
      alt: "Portfolio Ventures, brand and site",
      x: 15.3472,
      y: 56.3194,
      parallax: 20,
    },
    {
      slug: "manypixels",
      title: "Manypixels",
      discipline: "Development",
      alt: "The Manypixels home page on the brand's pale blue background",
      x: 57.0833,
      y: 85.9028,
      parallax: -16,
    },
  ].map((project) => ({
    ...project,
    image: `/images/projects/${project.slug}.webp`,
    hoverImage: `/images/projects/${project.slug}-hover.webp`,
    href: `${reference}/${project.slug}`,
  })),
};
