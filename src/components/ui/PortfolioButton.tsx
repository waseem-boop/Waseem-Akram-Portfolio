import type { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"a"> & {
  label: string;
  variant?: "primary" | "secondary";
};

/** Relayvo's sliding overlay and rolling text button, shared across the portfolio. */
export default function PortfolioButton({ label, variant = "primary", className = "", ...props }: Props) {
  return (
    <a {...props} className={`portfolio-button portfolio-button--${variant} ${className}`}>
      <span className="portfolio-button-label">
        <span>{label}</span><span aria-hidden="true">{label}</span>
      </span>
      <span className="portfolio-button-overlay" aria-hidden="true" />
    </a>
  );
}
