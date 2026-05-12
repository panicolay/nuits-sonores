import { Link, useParams } from "react-router-dom";
import { getScene, slugify } from "../data/programme";

export function Scene() {
  const { slug } = useParams();
  const scene = slug ? getScene(slug) : undefined;

  if (!scene) {
    return (
      <div>
        <h1>Scène introuvable</h1>
        <Link to="/">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className="scene">
      <h1>{scene.value}</h1>
      {scene.days.map((day) => (
        <section key={day.dayId} className="scene__day">
          <h2>{day.label}</h2>
          <ul className="scene__list">
            {day.sets.map((set) => (
              <li key={set.artiste}>
                <Link to={`/artiste/${slugify(set.artiste)}`}>
                  <span className="scene__time">
                    {set.debut}–{set.fin}
                  </span>
                  <span className="scene__artist">{set.artiste}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
