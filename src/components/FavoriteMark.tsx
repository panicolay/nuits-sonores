import { Heart } from "@phosphor-icons/react";

export function FavoriteMark({ size = 12 }: { size?: number }) {
  return (
    <Heart
      size={size}
      weight="regular"
      color="var(--accent-pink)"
      className="favorite-mark"
      aria-label="Favori"
    />
  );
}
