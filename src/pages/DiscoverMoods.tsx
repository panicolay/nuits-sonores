import { Link } from "react-router-dom";
import { getUpcomingMoods } from "../data/programme";
import { useNow } from "../data/now";

export function DiscoverMoods() {
  const now = useNow();
  const moods = getUpcomingMoods(now);

  return (
    <div className="discover">
      <h1>Moods</h1>
      {moods.length === 0 ? (
        <p className="filter__empty">Tous les sets sont terminés.</p>
      ) : (
        <ul className="discover__chips">
          {moods.map((m) => (
            <li key={m.slug}>
              <Link to={`/filtre/mood/${m.slug}`}>
                {m.value} <span className="discover__count">{m.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
