"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Copy, Menu, X } from "lucide-react";
import PortfolioButton from "@/components/ui/PortfolioButton";
import { siteConfig } from "@/data/siteConfig";

export default function Navbar() {
  const header = useRef<HTMLElement>(null);
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let entrance: Animation | undefined;
    const arrive = () => {
      const element = header.current;
      if (!element) return;
      entrance?.cancel();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      entrance = element.animate([
        { opacity: 0, transform: "translateY(-115%)", offset: 0 },
        { opacity: 1, transform: "translateY(7px)", offset: 0.76 },
        { opacity: 1, transform: "translateY(0)", offset: 1 },
      ], { duration: 900, easing: "cubic-bezier(.22,1,.36,1)" });
    };
    window.addEventListener("portfolio:hero-return", arrive);
    return () => {
      entrance?.cancel();
      window.removeEventListener("portfolio:hero-return", arrive);
    };
  }, []);

  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    [],
  );
  useEffect(() => {
    if (!open) return;
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key !== "Tab") return;
      const elements = [
        toggle.current,
        ...Array.from(
          panel.current?.querySelectorAll<HTMLElement>("a, button") ?? [],
        ),
      ].filter((element): element is HTMLElement => element !== null);
      const first = elements[0];
      const last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, [open]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setCopyState("idle"), 1800);
  }

  return (
    <header ref={header} className="site-header" data-open={open}>
      <div className="navbar">
        <div className="navbar-brand-row">
          <Link
            href="/"
            className="navbar-logo"
            aria-label={`${siteConfig.name} home`}
          >
            <span>{siteConfig.brand.firstLine}</span>
            <span>{siteConfig.brand.secondLine}</span>
          </Link>
          <button
            ref={toggle}
            className="navbar-toggle"
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <div ref={panel} className="navbar-panel" id={panelId}>
          <nav className="navbar-links" aria-label="Main navigation">
            {siteConfig.navigation.map((item) => {
              const isExternal = item.href.startsWith("http");
              return isExternal ? (
                <a
                  className="rolling-link"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={item.label}
                  onClick={() => setOpen(false)}
                >
                  <span>{item.label}</span>
                  <span aria-hidden="true">{item.label}</span>
                </a>
              ) : (
                <Link
                  className="rolling-link"
                  href={item.href}
                  key={item.label}
                  onClick={() => setOpen(false)}
                >
                  <span>{item.label}</span>
                  <span aria-hidden="true">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="navbar-inquiry">
            <p>{siteConfig.inquiry}</p>
            <button
              type="button"
              className="email-copy"
              onClick={copyEmail}
              aria-label={`Copy ${siteConfig.email}`}
            >
              <span>{siteConfig.email}</span>
              <span className="copy-tooltip" aria-hidden="true">
                <Copy size={14} />
                {copyState === "copied" ? "Copied!" : "Copy email"}
              </span>
            </button>
            <span className="sr-only" role="status">
              {copyState === "copied"
                ? "Email copied to clipboard"
                : copyState === "error"
                  ? `Could not copy. Email: ${siteConfig.email}`
                  : ""}
            </span>
          </div>
        </div>
        <PortfolioButton
          href={`mailto:${siteConfig.email}`}
          className="navbar-hire portfolio-button--nav"
          variant="secondary"
          label={siteConfig.hireLabel}
          aria-label={siteConfig.hireLabel}
        />
      </div>
    </header>
  );
}
