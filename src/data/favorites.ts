import { useEffect, useState } from "react";

const STORAGE_KEY = "nuits.favorites";

type Listener = () => void;
const listeners = new Set<Listener>();

function load(): ReadonlySet<string> {
  if (typeof localStorage === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr.filter((v) => typeof v === "string") : []);
  } catch {
    return new Set();
  }
}

let favorites: ReadonlySet<string> = load();

function persist() {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
}

export function getFavorites(): ReadonlySet<string> {
  return favorites;
}

export function isFavorite(slug: string): boolean {
  return favorites.has(slug);
}

export function toggleFavorite(slug: string): void {
  const next = new Set(favorites);
  if (next.has(slug)) next.delete(slug);
  else next.add(slug);
  favorites = next;
  persist();
  listeners.forEach((l) => l());
}

export function useFavorites(): ReadonlySet<string> {
  const [snapshot, setSnapshot] = useState<ReadonlySet<string>>(favorites);

  useEffect(() => {
    const update = () => setSnapshot(favorites);
    listeners.add(update);
    update();
    return () => {
      listeners.delete(update);
    };
  }, []);

  return snapshot;
}
