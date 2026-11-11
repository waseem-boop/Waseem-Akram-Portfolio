// Reference showcase content, not claims about Waseem's client projects.
export const selectedWork = {
  eyebrow: "Portfolio",
  heading: "Latest work",
  items: [
    {
      slug: "ai-vision-process",
      title: ["AI Vision", "Process"],
      category: "Advanced image & video recognition",
      image:
        "https://res.cloudinary.com/eckkgw2a/image/upload/v1794393003/waseem-akram/projects/work-vision.webp",
      alt: "Red-lit portrait framed by a luminous circular light",
    },
    {
      slug: "neurobot-system",
      title: ["NeuroBot", "System"],
      category: "Intelligent chatbot assistant",
      image:
        "https://res.cloudinary.com/eckkgw2a/image/upload/v1794393005/waseem-akram/projects/work-neurobot.webp",
      alt: "Contemporary cantilevered home with warm interior lighting",
    },
    {
      slug: "voiceiq-technology",
      title: ["VoiceIQ", "Technology"],
      category: "Speech recognition & voice AI",
      image:
        "https://res.cloudinary.com/eckkgw2a/image/upload/v1794393006/waseem-akram/projects/work-voiceiq.webp",
      alt: "Editorial artwork from the VoiceIQ technology project",
    },
    {
      slug: "edusmart-process",
      title: ["EduSmart", "Process"],
      category: "AI-enhanced e-learning solutions",
      image:
        "https://res.cloudinary.com/eckkgw2a/image/upload/v1794393006/waseem-akram/projects/work-edusmart.webp",
      alt: "Editorial artwork from the EduSmart learning project",
    },
  ].map((item) => ({
    ...item,
    href: `https://kreativedge.webflow.io/portfolio-details/${item.slug}`,
  })),
};
