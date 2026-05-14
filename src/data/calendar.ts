import type { ArtistSet } from "./types";
import { slugify } from "./programme";

function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [line.slice(0, 75)];
  for (let i = 75; i < line.length; i += 74) {
    parts.push(" " + line.slice(i, i + 74));
  }
  return parts.join("\r\n");
}

function formatLocal(isoDate: string, hhmm: string): string {
  return `${isoDate.replace(/-/g, "")}T${hhmm.replace(":", "")}00`;
}

function addOneDay(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

function dtstampUTC(): string {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function buildICS(set: ArtistSet): string {
  // Floating local time (no TZID/Z): calendars interpret it as the device's local time,
  // which matches the festival-goer's experience in Lyon.
  const endDate = set.fin <= set.debut ? addOneDay(set.date) : set.date;
  const dtstart = formatLocal(set.date, set.debut);
  const dtend = formatLocal(endDate, set.fin);
  const uid = `${slugify(set.artiste)}-${set.date}-${set.debut.replace(":", "")}@nuits-sonores-2026`;
  const summary = `${set.artiste} — ${set.scene}`;
  const location = `${set.scene} · Nuits Sonores 2026`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nuits Sonores 2026//FR",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstampUTC()}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${escapeText(summary)}`,
    `DESCRIPTION:${escapeText(set.description)}`,
    `LOCATION:${escapeText(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.map(foldLine).join("\r\n") + "\r\n";
}

export function downloadICS(set: ArtistSet): void {
  const ics = buildICS(set);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slugify(set.artiste)}.ics`;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
