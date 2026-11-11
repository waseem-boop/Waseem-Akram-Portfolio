import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { siteConfig } from "@/data/siteConfig";
import { serviceShowcase } from "@/data/serviceShowcase";
import { techStackData } from "@/data/techstack";
import SmoothScroll from "@/components/layout/SmoothScroll";
import "lenis/dist/lenis.css";
import "./globals.css";
import "@/styles/navbar.css";
import "@/styles/hero.css";
import "@/styles/statement.css";
import "@/styles/selected-work.css";
import "@/styles/services.css";
import "@/styles/brand-vision.css";
import "@/styles/process-showcase.css";
import "@/styles/testimonials.css";
import "@/styles/techstack.css";
import "@/styles/contact-cta.css";
import "@/styles/footer.css";
import "@/styles/brand-theme.css";
import "@/styles/buttons.css";

const interDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/inter-display-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/inter-display-semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/inter-display-extrabold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/inter-display-black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-inter-display",
  display: "swap",
});

const syne = localFont({
  src: "../../public/fonts/syne-medium.woff2",
  variable: "--font-statement",
  display: "swap",
  weight: "500",
});

const portfolioFont = localFont({
  src: "../../public/fonts/aeonik-medium.woff2",
  variable: "--font-portfolio",
  display: "swap",
  weight: "500",
});

const serviceDisplay = localFont({
  src: "../../public/fonts/archivo-variable.woff2",
  variable: "--font-service-display",
  display: "swap",
  weight: "100 900",
});

const serviceMono = localFont({
  src: "../../public/fonts/geist-mono.woff2",
  variable: "--font-service-mono",
  display: "swap",
  weight: "400",
});

const SITE_URL = "https://www.waseemakram.dev";

const serviceTypeById: Record<string, string> = {
  websites: "Web & E-commerce Development",
  saas: "SaaS Platform Development",
  mobile: "Mobile App Development",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#portrait-image`,
      url: `${SITE_URL}/images/waseem-akram.png`,
      contentUrl: `${SITE_URL}/images/waseem-akram.png`,
      width: 1200,
      height: 1200,
      encodingFormat: "image/png",
      name: siteConfig.name,
      caption: `${siteConfig.name} — Full-stack Developer & SaaS Architect`,
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: siteConfig.name,
      url: `${SITE_URL}/`,
      jobTitle: "Full-stack Developer & SaaS Architect",
      description: siteConfig.description,
      email: siteConfig.email,
      image: {
        "@id": `${SITE_URL}/#portrait-image`,
      },
      sameAs: [
        "https://www.wikidata.org/wiki/Q141748945",
        "https://www.linkedin.com/in/waseemakramdev",
        "https://github.com/waseemakram-dev",
        "https://x.com/iamwaseemdev",
        "https://www.behance.net/iamwaseemdev",
        "https://dribbble.com/waseemakramdev",
        "https://www.tiktok.com/@iamwaseemdev",
      ],
      knowsAbout: [
        "Full-Stack Development",
        "SaaS Architecture",
        "Web Development",
        "Mobile App Development",
        ...techStackData.rows.flat().map((tool) => tool.label),
      ],
      hasOfferCatalog: {
        "@id": `${SITE_URL}/#offer-catalog`,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: siteConfig.name,
      description: siteConfig.description,
      inLanguage: "en",
      publisher: {
        "@id": `${SITE_URL}/#person`,
      },
    },
    {
      "@type": ["WebPage", "ProfilePage"],
      "@id": `${SITE_URL}/#webpage`,
      url: `${SITE_URL}/`,
      name: `${siteConfig.name} | Full-stack Developer & SaaS Architect`,
      description: siteConfig.description,
      inLanguage: "en",
      isPartOf: {
        "@id": `${SITE_URL}/#website`,
      },
      about: {
        "@id": `${SITE_URL}/#person`,
      },
      mainEntity: {
        "@id": `${SITE_URL}/#person`,
      },
      primaryImageOfPage: {
        "@id": `${SITE_URL}/#portrait-image`,
      },
    },
    ...serviceShowcase.items.map((service) => ({
      "@type": "Service",
      "@id": `${SITE_URL}/#service-${service.id}`,
      name: service.title,
      serviceType: serviceTypeById[service.id] ?? service.title,
      description: service.description,
      url: `${SITE_URL}/#services`,
      areaServed: "Worldwide",
      provider: {
        "@id": `${SITE_URL}/#person`,
      },
    })),
    {
      "@type": "OfferCatalog",
      "@id": `${SITE_URL}/#offer-catalog`,
      name: `Services by ${siteConfig.name}`,
      itemListElement: serviceShowcase.items.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@id": `${SITE_URL}/#service-${service.id}`,
        },
      })),
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${siteConfig.name} | Full-stack Developer & SaaS Architect`,
  description: siteConfig.description,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${interDisplay.variable} ${syne.variable} ${portfolioFont.variable} ${serviceDisplay.variable} ${serviceMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Script id="start-at-hero" strategy="beforeInteractive">{
          `history.scrollRestoration = "manual";
          if (location.hash) history.replaceState(history.state, "", location.pathname + location.search);
          window.scrollTo(0, 0);`
        }</Script>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
