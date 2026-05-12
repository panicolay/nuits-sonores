import { Link, useParams } from "react-router-dom";
import {
  getArtistsByFilter,
  getFilterLabel,
  slugify,
} from "../data/programme";
import { getGenreDescription } from "../data/genres";
import type { FilterType } from "../data/types";

export function Filter() {
  const { type, slug } = useParams();
  const filterType = type as FilterType;

  if (filterType !== "genre" && filterType !== "mood") {
    return <NotMatched />;
  }

  const label = slug ? getFilterLabel(filterType, slug) : undefined;
  const artists = slug ? getArtistsByFilter(filterType, slug) : [];
  const description =
    filterType === "genre" && slug ? getGenreDescription(slug) : undefined;

  if (!label || artists.length === 0) {
    return <NotMatched />;
  }

  return (
    <div className="filter">
      <p className="filter__type">
        {filterType === "genre" ? "Genre" : "Mood"}
      </p>
      <h1>{label}</h1>
      {description && <p className="filter__description">{description}</p>}
      <p className="filter__count">{artists.length} artistes</p>
      <ul className="filter__list">
        {artists.map((set) => (
          <li key={set.artiste}>
            <Link to={`/artiste/${slugify(set.artiste)}`}>
              <span>{set.artiste}</span>
              <span className="filter__meta">
                {set.jour} · {set.scene}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NotMatched() {
  return (
    <div>
      <h1>Filtre introuvable</h1>
      <Link to="/decouvrir">Retour à la découverte</Link>
    </div>
  );
}
