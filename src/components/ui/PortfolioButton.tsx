import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"a"> & {
  label: string;
  variant?: "primary" | "secondary";
};

/** Relayvo's sliding overlay and rolling text button, shared across the portfolio. */
export default function PortfolioButton({ label, variant = "primary", className = "", href, ...props }: Props) {
  const classes = `portfolio-button portfolio-button--${variant} ${className}`;
  const inner = (
    <>
      <span className="portfolio-button-label">
        <span>{label}</span><span aria-hidden="true">{label}</span>
      </span>
      <span className="portfolio-button-overlay" aria-hidden="true" />
    </>
  );

  if (href && href.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link href={href} {...props} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <a href={href} {...props} className={classes}>
      {inner}
    </a>
  );
}
