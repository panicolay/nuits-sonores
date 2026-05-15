import { Smiley } from "@phosphor-icons/react";

export function PickMark({ size = 12 }: { size?: number }) {
  return (
    <Smiley
      size={size}
      weight="regular"
      color="var(--pick)"
      className="pick-mark"
      aria-label="Incontournable"
    />
  );
}
