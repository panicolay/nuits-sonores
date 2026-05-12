import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getArtistsByFilter,
  getFilterLabel,
  getSetStatus,
  slugify,
} from "../data/programme";
import { getGenreDescription } from "../data/genres";
import { useNow } from "../data/now";
import { SetBadge } from "../components/SetBadge";
import type { FilterType } from "../data/types";

export function Filter() {
  const { type, slug } = useParams();
  const filterType = type as FilterType;
  const now = useNow();

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

  const upcoming = artists
    .map((set) => ({ set, status: getSetStatus(set, now) }))
    .filter((entry) => entry.status !== "past");

  return (
    <div className="filter">
      <p className="filter__type">
        {filterType === "genre" ? "Genre" : "Mood"}
      </p>
      <h1>{label}</h1>
      {description && <GenreDescription text={description} />}
      <p className="filter__count">
        {upcoming.length} artiste{upcoming.length > 1 ? "s" : ""} à venir
      </p>
      {upcoming.length === 0 ? (
        <p className="filter__empty">Tous les sets sont terminés.</p>
      ) : (
        <ul className="filter__list">
          {upcoming.map(({ set, status }) => (
            <li key={set.artiste}>
              <Link to={`/artiste/${slugify(set.artiste)}`}>
                <span className="filter__main">
                  <span className="filter__name">{set.artiste}</span>
                  <SetBadge status={status} />
                </span>
                <span className="filter__meta">
                  {set.jour} · {set.scene}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function GenreDescription({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    if (!ref.current || expanded) return;
    const el = ref.current;
    const measure = () =>
      setOverflowing(el.scrollHeight > el.clientHeight + 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, expanded]);

  return (
    <div className="filter__description">
      <p
        ref={ref}
        className={`filter__description-text${expanded ? " is-expanded" : ""}`}
      >
        {text}
      </p>
      {(overflowing || expanded) && (
        <button
          type="button"
          className="filter__description-toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Afficher moins" : "Afficher plus"}
        </button>
      )}
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
