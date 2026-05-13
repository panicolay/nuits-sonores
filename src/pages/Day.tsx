import { Link, useParams } from "react-router-dom";
import type { ArtistSet } from "../data/types";
import {
  getDay,
  getSetStatus,
  slugify,
  type SetStatus,
} from "../data/programme";
import { useNow } from "../data/now";
import { SetBadge } from "../components/SetBadge";
import { PickMark } from "../components/PickMark";

type Entry = { set: ArtistSet; status: SetStatus };

function SetItem({ set, status }: Entry) {
  return (
    <li className={`day__item day__item--${status}`}>
      <Link to={`/artiste/${slugify(set.artiste)}`}>
        <span className="day__time">
          {set.debut}–{set.fin}
        </span>
        <span className="day__scene">{set.scene}</span>
        <span className="day__artist">
          <span className="day__name">
            {set.artiste}
            {set.incontournable && <PickMark />}
          </span>
          <SetBadge status={status} />
        </span>
      </Link>
    </li>
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

  const entries: Entry[] = day.sets.map((set) => ({
    set,
    status: getSetStatus(set, now),
  }));
  const past = entries.filter((e) => e.status === "past");
  const upcoming = entries.filter((e) => e.status !== "past");

  return (
    <div className="day">
      <h1>{day.label}</h1>
      {past.length > 0 && (
        <details className="day__past">
          <summary>Sets terminés ({past.length})</summary>
          <ul className="day__list">
            {past.map((entry) => (
              <SetItem key={entry.set.artiste} {...entry} />
            ))}
          </ul>
        </details>
      )}
      <ul className="day__list">
        {upcoming.map((entry) => (
          <SetItem key={entry.set.artiste} {...entry} />
        ))}
      </ul>
    </div>
  );
}
