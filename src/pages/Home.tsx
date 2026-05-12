import { Navigate } from "react-router-dom";
import { days } from "../data/programme";
import { getNow } from "../data/now";

function pickDayId(): string {
  const today = getNow().toISOString().slice(0, 10);
  const sorted = days.slice().sort((a, b) => a.date.localeCompare(b.date));
  const exact = sorted.find((d) => d.date === today);
  if (exact) return exact.id;
  const upcoming = sorted.find((d) => d.date > today);
  if (upcoming) return upcoming.id;
  return sorted[sorted.length - 1].id;
}

export function Home() {
  return <Navigate to={`/jour/${pickDayId()}`} replace />;
}
