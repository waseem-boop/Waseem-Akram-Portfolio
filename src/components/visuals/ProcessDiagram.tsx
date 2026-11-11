import { processLayouts } from "@/lib/processGeometry";

export default function ProcessDiagram() {
  return (
    <>
      <svg
        className="process-curve"
        viewBox="0 0 1200 480"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          className="process-curve-draw"
          d={processLayouts.desktop.path}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1}
        />
      </svg>
      <span className="process-moving-dot" aria-hidden="true" />
    </>
  );
}
