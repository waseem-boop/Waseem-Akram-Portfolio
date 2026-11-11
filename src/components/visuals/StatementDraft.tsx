import { useId } from "react";

export default function StatementDraft() {
  const id = useId().replace(/[^\w-]/g, "");
  return (
    <svg
      className="statement-draft"
      data-draft-id={`statement-${id}`}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
    />
  );
}
