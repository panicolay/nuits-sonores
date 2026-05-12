import { Link } from "react-router-dom";
import { genresByGroup } from "../data/programme";

export function DiscoverGenres() {
  return (
    <div className="discover">
      <h1>Genres</h1>
      {genresByGroup.map((group) => (
        <section key={group.label} className="discover__group">
          <h2 className="discover__group-label">{group.label}</h2>
          <ul className="discover__list">
            {group.items.map((g) => (
              <li key={g.slug}>
                <Link to={`/filtre/genre/${g.slug}`}>
                  <span className="discover__item-name">{g.value}</span>
                  <span className="discover__item-count">{g.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
