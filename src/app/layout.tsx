import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { siteConfig } from "@/data/siteConfig";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://waseemakram.dev"),
  title: `${siteConfig.name} | Full-stack Developer & SaaS Architect`,
  description: siteConfig.description,
  robots: { index: false, follow: false },
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
