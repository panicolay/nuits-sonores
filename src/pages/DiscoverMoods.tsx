import { Link } from "react-router-dom";
import { allMoods } from "../data/programme";

export function DiscoverMoods() {
  return (
    <div className="discover">
      <h1>Moods</h1>
      <ul className="discover__chips">
        {allMoods.map((m) => (
          <li key={m.slug}>
            <Link to={`/filtre/mood/${m.slug}`}>
              {m.value} <span className="discover__count">{m.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
