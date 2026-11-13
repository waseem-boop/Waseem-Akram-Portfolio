import type { Metadata, Viewport } from "next";
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
import "@/styles/projects-pages.css";
import "@/styles/genstudio-projects.css";

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

const SITE_URL = "https://www.waseemakram.dev";
const PAGE_TITLE = `${siteConfig.name} | Full-stack Developer & SaaS Architect`;
const OG_IMAGE_URL =
  "https://res.cloudinary.com/eckkgw2a/image/upload/v1794463368/waseem-akram/seo/og-banner-waseem.jpg";

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
      url: "https://res.cloudinary.com/eckkgw2a/image/upload/v1794393004/waseem-akram/seo/waseem-akram.jpg",
      contentUrl:
        "https://res.cloudinary.com/eckkgw2a/image/upload/v1794393004/waseem-akram/seo/waseem-akram.jpg",
      width: 1200,
      height: 1200,
      encodingFormat: "image/jpeg",
      name: siteConfig.name,
      caption: `${siteConfig.name} — Full-stack Developer & SaaS Architect`,
    },
    {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#og-image`,
      url: OG_IMAGE_URL,
      contentUrl: OG_IMAGE_URL,
      width: 1200,
      height: 630,
      encodingFormat: "image/jpeg",
      name: PAGE_TITLE,
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
        "https://hashnode.com/@waseemakramdev",
        "https://dev.to/waseemakramdev",
        "https://medium.com/@waseemakramdev",
        "https://www.producthunt.com/@waseemakramdev",
        "https://clutch.co/profile/waseem-akram",
        "https://waseemakram.online/",
        "https://www.behance.net/iamwaseemdev",
        "https://dribbble.com/waseemakramdev",
        "https://www.instagram.com/iamwaseemdev/",
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
      name: PAGE_TITLE,
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
        "@id": `${SITE_URL}/#og-image`,
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

export const viewport: Viewport = {
  themeColor: "#051f20",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: PAGE_TITLE,
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  authors: [{ name: siteConfig.name, url: `${SITE_URL}/` }],
  creator: siteConfig.name,
  keywords: [
    "Waseem Akram",
    "Full-stack Developer",
    "SaaS Architect",
    "Next.js Developer",
    "Web Application Development",
    "React Developer",
    "TypeScript",
    "Scalable Software Architecture",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${SITE_URL}/`,
    siteName: siteConfig.name,
    title: PAGE_TITLE,
    description: siteConfig.description,
    images: [
      {
        url: OG_IMAGE_URL,
        secureUrl: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: PAGE_TITLE,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@iamwaseemdev",
    creator: "@iamwaseemdev",
    title: PAGE_TITLE,
    description: siteConfig.description,
    images: [
      {
        url: OG_IMAGE_URL,
        alt: PAGE_TITLE,
        width: 1200,
        height: 630,
      },
    ],
  },
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
      className={interDisplay.variable}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
        />
        <script
          id="gtm-init"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Script
          id="gtm-script"
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtm.js?id=GTM-TRD25QPC"
        />
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
