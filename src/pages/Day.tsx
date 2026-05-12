import { Link, useParams } from "react-router-dom";
import { getDay, slugify } from "../data/programme";

export function Day() {
  const { dayId } = useParams();
  const day = dayId ? getDay(dayId) : undefined;

  if (!day) {
    return (
      <div>
        <h1>Jour introuvable</h1>
        <Link to="/">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className="day">
      <h1>
        {day.label} <span className="day__date">{day.date}</span>
      </h1>
      <ul className="day__list">
        {day.sets.map((set) => (
          <li key={set.artiste}>
            <Link to={`/artiste/${slugify(set.artiste)}`}>
              <span className="day__time">
                {set.debut}–{set.fin}
              </span>
              <span className="day__scene">{set.scene}</span>
              <span className="day__artist">{set.artiste}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
