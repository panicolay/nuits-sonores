import { Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import type { ArtistSet } from "../data/types";
import {
  SCENES,
  getDay,
  setEnd,
  setStart,
  slugify,
} from "../data/programme";
import { useNow } from "../data/now";
import { PickMark } from "../components/PickMark";

const MS_PER_MIN = 60_000;

const SCENE_TRIGRAMS: Record<string, string> = {
  Outdoor: "OUT",
  Nef: "NEF",
  Soundsystem: "SND",
  Darse: "DAR",
};

type SlotState = "past" | "live" | "future";

type Slot = {
  set: ArtistSet;
  state: SlotState;
  column: number;
  startRow: number;
  endRow: number;
};

type HourMark = {
  row: number;
  label: string;
};

function buildHourMarks(startMs: number, endMs: number): HourMark[] {
  const marks: HourMark[] = [];
  const first = new Date(startMs);
  first.setMinutes(0, 0, 0);
  if (first.getTime() < startMs) first.setHours(first.getHours() + 1);
  for (let t = first.getTime(); t <= endMs; t += 60 * MS_PER_MIN) {
    const d = new Date(t);
    const hour = d.getHours();
    marks.push({
      row: Math.round((t - startMs) / MS_PER_MIN) + 1,
      label: hour.toString().padStart(2, "0"),
    });
  }
  return marks;
}

function SlotCard({ slot }: { slot: Slot }) {
  const { set, state, column, startRow, endRow } = slot;
  const className = [
    "timetable__slot",
    `timetable__slot--${state}`,
    set.incontournable ? "timetable__slot--pick" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Link
      to={`/artiste/${slugify(set.artiste)}`}
      className={className}
      style={{ gridColumn: column, gridRow: `${startRow} / ${endRow}` }}
    >
      <span className="timetable__name">
        {set.artiste}
        {set.incontournable && <PickMark />}
      </span>
      <span className="timetable__time">
        {set.debut}–{set.fin}
      </span>
    </Link>
  );
}

export function Day() {
  const { dayId } = useParams();
  const day = dayId ? getDay(dayId) : undefined;
  const now = useNow();

  if (!day) {
    return (
      <div>
        <h1>Jour introuvable</h1>
        <Link to="/">Retour à l'accueil</Link>
      </div>
    );
  }

  const startMs = Math.min(...day.sets.map((s) => setStart(s).getTime()));
  const endMs = Math.max(...day.sets.map((s) => setEnd(s).getTime()));
  const totalMin = Math.ceil((endMs - startMs) / MS_PER_MIN);
  const hours = buildHourMarks(startMs, endMs);

  const nowMs = now.getTime();
  const slots: Slot[] = day.sets.map((set) => {
    const startTs = setStart(set).getTime();
    const endTs = setEnd(set).getTime();
    const column = SCENES.indexOf(set.scene as (typeof SCENES)[number]) + 2;
    const startRow = Math.round((startTs - startMs) / MS_PER_MIN) + 1;
    const endRow = Math.round((endTs - startMs) / MS_PER_MIN) + 1;
    let state: SlotState = "future";
    if (nowMs >= endTs) state = "past";
    else if (nowMs >= startTs) state = "live";
    return { set, state, column, startRow, endRow };
  });

  const nowMin = (nowMs - startMs) / MS_PER_MIN;
  const showNow = nowMin >= 0 && nowMin <= totalMin;
  const nowRow = Math.max(1, Math.round(nowMin) + 1);

  const bodyStyle = { "--rows": totalMin } as React.CSSProperties;

  return (
    <div className="day">
      <h1>{day.label}</h1>
      <div className="timetable">
        <div className="timetable__head">
          <div className="timetable__corner" aria-hidden />
          {SCENES.map((scene) => (
            <div
              key={scene}
              className="timetable__scene-head"
              title={scene}
            >
              {SCENE_TRIGRAMS[scene] ?? scene}
            </div>
          ))}
        </div>
        <div className="timetable__body" style={bodyStyle}>
          {hours.map((h) => (
            <Fragment key={h.row}>
              <span
                className="timetable__hour-label"
                style={{ gridRow: h.row }}
              >
                {h.label}
              </span>
              <span
                className="timetable__hour-line"
                style={{ gridRow: h.row }}
                aria-hidden
              />
            </Fragment>
          ))}
          {slots.map((slot) => (
            <SlotCard key={slot.set.artiste} slot={slot} />
          ))}
          {showNow && (
            <div
              className="timetable__now"
              style={{ gridRow: nowRow }}
              aria-hidden
            />
          )}
        </div>
      </div>
    </div>
  );
}
