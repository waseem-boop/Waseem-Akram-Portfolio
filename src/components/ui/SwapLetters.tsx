import type { CSSProperties } from "react";

export default function SwapLetters({ label }: { label: string }) {
  return (
    <span className="swap-letters" aria-hidden="true">
      {Array.from(label).map((letter, index) => (
        <span
          className={`swap-letter ${index % 2 === 0 ? "swap-letter--even" : "swap-letter--odd"}`}
          key={`${index}-${letter}`}
          style={{ "--letter-delay": `${index * 18}ms` } as CSSProperties}
        >
          <span className="swap-letter-track">
            <span>{letter === " " ? "\u00a0" : letter}</span>
            <span>{letter === " " ? "\u00a0" : letter}</span>
          </span>
        </span>
      ))}
    </span>
  );
}
