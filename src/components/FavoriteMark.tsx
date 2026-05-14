import { Heart } from "@phosphor-icons/react";

export function FavoriteMark() {
  return (
    <Heart
      size={12}
      weight="regular"
      color="var(--accent-pink)"
      className="favorite-mark"
      aria-label="Favori"
    />
  );
}
