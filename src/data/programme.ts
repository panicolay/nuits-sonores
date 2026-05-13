import raw from "../../programme.json";
import type {
  ArtistSet,
  Day,
  DayId,
  FilterCount,
  Scene,
  SceneDay,
} from "./types";

export const programme: ArtistSet[] = raw as ArtistSet[];

export const SCENES = ["Nef", "Soundsystem", "Outdoor", "Darse"] as const;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function dayIdFromLabel(label: string): DayId {
  return label.toLowerCase().replace(/\s+/g, "-") as DayId;
}

function frenchWeekday(isoDate: string): string {
  const weekday = new Date(`${isoDate}T00:00:00`).toLocaleDateString("fr-FR", {
    weekday: "long",
  });
  return weekday.charAt(0).toUpperCase() + weekday.slice(1);
}

export const days: Day[] = (() => {
  const groups = new Map<string, ArtistSet[]>();
  for (const set of programme) {
    if (!groups.has(set.jour)) groups.set(set.jour, []);
    groups.get(set.jour)!.push(set);
  }
  return [...groups.entries()].map(([rawLabel, sets]) => {
    const date = sets[0].date;
    return {
      id: dayIdFromLabel(rawLabel),
      label: frenchWeekday(date),
      date,
      sets: sets.slice().sort((a, b) => a.debut.localeCompare(b.debut)),
    };
  });
})();

export function getDay(id: string): Day | undefined {
  return days.find((d) => d.id === id);
}

export function getArtistBySlug(slug: string): ArtistSet | undefined {
  return programme.find((s) => slugify(s.artiste) === slug);
}

export type SetStatus = "past" | "live" | "soon" | "future";

const SOON_MS = 30 * 60 * 1000;

export function setStart(set: ArtistSet): Date {
  return new Date(`${set.date}T${set.debut}:00`);
}

export function setEnd(set: ArtistSet): Date {
  const start = setStart(set);
  const end = new Date(`${set.date}T${set.fin}:00`);
  if (end.getTime() <= start.getTime()) {
    end.setDate(end.getDate() + 1);
  }
  return end;
}

export function getSetStatus(set: ArtistSet, now: Date): SetStatus {
  const start = setStart(set).getTime();
  const end = setEnd(set).getTime();
  const t = now.getTime();
  if (t >= end) return "past";
  if (t >= start) return "live";
  if (start - t <= SOON_MS) return "soon";
  return "future";
}

export const scenes: { value: string; slug: string }[] = SCENES.filter((s) =>
  programme.some((set) => set.scene === s),
).map((s) => ({ value: s, slug: slugify(s) }));

export function getScene(slug: string): Scene | undefined {
  const value = SCENES.find((s) => slugify(s) === slug);
  if (!value) return undefined;

  const groups = new Map<string, ArtistSet[]>();
  for (const set of programme) {
    if (set.scene !== value) continue;
    if (!groups.has(set.jour)) groups.set(set.jour, []);
    groups.get(set.jour)!.push(set);
  }

  const sceneDays: SceneDay[] = [...groups.entries()]
    .map(([rawLabel, daySets]) => {
      const day = days.find((d) => d.id === dayIdFromLabel(rawLabel));
      return {
        dayId: dayIdFromLabel(rawLabel),
        label: day?.label ?? rawLabel,
        date: daySets[0].date,
        sets: daySets.slice().sort((a, b) => a.debut.localeCompare(b.debut)),
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  return { value, slug, days: sceneDays };
}

function countValues(picker: (set: ArtistSet) => string[]): FilterCount[] {
  const counts = new Map<string, number>();
  for (const set of programme) {
    for (const v of picker(set)) {
      counts.set(v, (counts.get(v) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, slug: slugify(value), count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

export const allGenres: FilterCount[] = countValues((s) => s.genres);
export const allMoods: FilterCount[] = countValues((s) => s.moods);

const GENRE_GROUPS: { label: string; genres: string[] }[] = [
  {
    label: "Techno",
    genres: [
      "techno",
      "acid techno",
      "dub techno",
      "hard techno",
      "industrial techno",
      "minimal techno",
      "hardcore",
      "trance",
    ],
  },
  {
    label: "House & electro",
    genres: ["house", "tech house", "progressive house", "electro"],
  },
  {
    label: "Bass / sound system UK",
    genres: [
      "UK funky",
      "UK garage",
      "dubstep",
      "grime",
      "bass music",
      "drum & bass",
      "jungle",
      "footwork",
      "breakbeat",
      "breakcore",
    ],
  },
  {
    label: "Club global",
    genres: [
      "afro club",
      "amapiano",
      "gqom",
      "kuduro",
      "baile funk",
      "dabké",
      "raï",
      "deconstructed club",
    ],
  },
  {
    label: "Ambient & experimental",
    genres: [
      "ambient",
      "downtempo",
      "IDM",
      "experimental",
      "noise",
      "live coding",
      "chiptune",
    ],
  },
  {
    label: "Pop & rock",
    genres: [
      "indie rock",
      "dream pop",
      "shoegaze",
      "hyperpop",
      "pop expérimentale",
    ],
  },
  {
    label: "Hip-hop & jazz",
    genres: ["rap", "trap", "jazz hip-hop", "spiritual jazz"],
  },
];

export type GenreGroup = { label: string; items: FilterCount[] };

export const genresByGroup: GenreGroup[] = (() => {
  const byValue = new Map(allGenres.map((g) => [g.value, g]));
  const claimed = new Set<string>();
  const groups: GenreGroup[] = GENRE_GROUPS.map(({ label, genres }) => {
    const items: FilterCount[] = [];
    for (const value of genres) {
      const match = byValue.get(value);
      if (match) {
        items.push(match);
        claimed.add(value);
      }
    }
    return { label, items };
  }).filter((g) => g.items.length > 0);

  const orphans = allGenres.filter((g) => !claimed.has(g.value));
  if (orphans.length > 0) {
    groups.push({ label: "Autres", items: orphans });
  }
  return groups;
})();

export function getArtistsByFilter(
  type: "genre" | "mood",
  slug: string,
): ArtistSet[] {
  const key = type === "genre" ? "genres" : "moods";
  return programme.filter((s) => s[key].some((v) => slugify(v) === slug));
}

export function getFilterDays(
  type: "genre" | "mood",
  slug: string,
): SceneDay[] {
  const sets = getArtistsByFilter(type, slug);
  const groups = new Map<string, ArtistSet[]>();
  for (const set of sets) {
    if (!groups.has(set.jour)) groups.set(set.jour, []);
    groups.get(set.jour)!.push(set);
  }
  return [...groups.entries()]
    .map(([rawLabel, daySets]) => {
      const day = days.find((d) => d.id === dayIdFromLabel(rawLabel));
      return {
        dayId: dayIdFromLabel(rawLabel),
        label: day?.label ?? rawLabel,
        date: daySets[0].date,
        sets: daySets.slice().sort((a, b) => a.debut.localeCompare(b.debut)),
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getFilterLabel(
  type: "genre" | "mood",
  slug: string,
): string | undefined {
  const list = type === "genre" ? allGenres : allMoods;
  return list.find((f) => f.slug === slug)?.value;
}
