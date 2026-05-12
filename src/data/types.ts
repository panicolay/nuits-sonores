export type Scene = "Nef" | "Soundsystem" | "Outdoor" | "Darse";
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
};

export type FilterType = "genre" | "mood";

export type Day = {
  id: DayId;
  label: string;
  date: string;
  sets: ArtistSet[];
};

export type FilterCount = {
  value: string;
  slug: string;
  count: number;
};
