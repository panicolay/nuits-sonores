import { Link, useParams } from "react-router-dom";
import { getScene, getSetStatus, slugify } from "../data/programme";
import { useNow } from "../data/now";
import { SetBadge } from "../components/SetBadge";
import { PickMark } from "../components/PickMark";

export function Scene() {
  const { slug } = useParams();
  const scene = slug ? getScene(slug) : undefined;
  const now = useNow();

  if (!scene) {
    return (
      <div>
        <h1>Scène introuvable</h1>
        <Link to="/">Retour à l'accueil</Link>
      </div>
    );
  }

  const days = scene.days
    .map((day) => ({
      ...day,
      sets: day.sets
        .map((set) => ({ set, status: getSetStatus(set, now) }))
        .filter((entry) => entry.status !== "past"),
    }))
    .filter((day) => day.sets.length > 0);

  return (
    <div className="scene">
      <h1>{scene.value}</h1>
      {days.map((day) => (
        <section key={day.dayId} className="scene__day">
          <h2>{day.label}</h2>
          <ul className="scene__list">
            {day.sets.map(({ set, status }) => (
              <li key={set.artiste}>
                <Link to={`/artiste/${slugify(set.artiste)}`}>
                  <span className="scene__time">
                    {set.debut}–{set.fin}
                  </span>
                  <span className="scene__artist">
                    <span className="scene__name">
                      {set.artiste}
                      {set.incontournable && <PickMark />}
                    </span>
                    <SetBadge status={status} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
