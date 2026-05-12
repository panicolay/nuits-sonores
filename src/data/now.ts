import { useEffect, useState } from "react";

const STORAGE_KEY = "nuits.debug-now";
const TICK_MS = 30_000;

type Listener = () => void;
const listeners = new Set<Listener>();

function readOverride(): Date | null {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

let override: Date | null = readOverride();

export function getNow(): Date {
  return override ?? new Date();
}

export function getDebugNow(): Date | null {
  return override;
}

export function setDebugNow(date: Date | null): void {
  override = date;
  if (date) localStorage.setItem(STORAGE_KEY, date.toISOString());
  else localStorage.removeItem(STORAGE_KEY);
  listeners.forEach((l) => l());
}

export function useNow(): Date {
  const [now, setNow] = useState<Date>(getNow);

  useEffect(() => {
    const update = () => setNow(getNow());
    listeners.add(update);
    const interval = window.setInterval(update, TICK_MS);
    return () => {
      listeners.delete(update);
      window.clearInterval(interval);
    };
  }, []);

  return now;
}
