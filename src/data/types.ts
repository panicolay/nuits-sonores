export type DayId = "day-2" | "day-3";

export type ArtistSet = {
  jour: string;
  date: string;
  scene: string;
  artiste: string;
  debut: string;
  fin: string;
  description: string;
  artistes_lies: string[];
  genres: string[];
  moods: string[];
  incontournable?: string;
};

export type FilterType = "genre" | "mood";

export type Day = {
  id: DayId;
  label: string;
  date: string;
  sets: ArtistSet[];
};

export type SceneDay = {
  dayId: DayId;
  label: string;
  date: string;
  sets: ArtistSet[];
};

export type Scene = {
  value: string;
  slug: string;
  days: SceneDay[];
};

export type FilterCount = {
  value: string;
  slug: string;
  count: number;
};
