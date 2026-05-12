import { Link } from "react-router-dom";
import { days, scenes } from "../data/programme";

export function Home() {
  return (
    <div className="home">
      <section className="home__section">
        <h2>Jour</h2>
        <ul className="home__list">
          {days.map((day) => (
            <li key={day.id}>
              <Link to={`/jour/${day.id}`}>{day.label}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="home__section">
        <h2>Scène</h2>
        <ul className="home__list">
          {scenes.map((scene) => (
            <li key={scene.slug}>
              <Link to={`/scene/${scene.slug}`}>{scene.value}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="home__section">
        <h2>Découvrir</h2>
        <ul className="home__list">
          <li>
            <Link to="/decouvrir/moods">Mood</Link>
          </li>
          <li>
            <Link to="/decouvrir/genres">Genre</Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
