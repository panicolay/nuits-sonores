import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getFilterDays,
  getFilterLabel,
  getSetStatus,
  slugify,
} from "../data/programme";
import { getGenreDescription } from "../data/genres";
import { useNow } from "../data/now";
import { useFavorites } from "../data/favorites";
import { SetBadge } from "../components/SetBadge";
import { PickMark } from "../components/PickMark";
import { FavoriteMark } from "../components/FavoriteMark";
import { usePageTitle } from "../components/PageTitle";
import type { FilterType } from "../data/types";

export function Filter() {
  const { type, slug } = useParams();
  const filterType = type as FilterType;
  const now = useNow();
  const favorites = useFavorites();

  const isValidType = filterType === "genre" || filterType === "mood";
  const label = isValidType && slug ? getFilterLabel(filterType, slug) : undefined;
  const rawDays = isValidType && slug ? getFilterDays(filterType, slug) : [];
  const description =
    filterType === "genre" && slug ? getGenreDescription(slug) : undefined;

  usePageTitle(label ?? "Filtre introuvable");

  if (!isValidType || !label || rawDays.length === 0) {
    return <NotMatched />;
  }

  const days = rawDays
    .map((day) => ({
      ...day,
      sets: day.sets
        .map((set) => ({ set, status: getSetStatus(set, now) }))
        .filter((entry) => entry.status !== "past"),
    }))
    .filter((day) => day.sets.length > 0);

  const upcomingCount = days.reduce((sum, d) => sum + d.sets.length, 0);

  return (
    <div className="filter">
      {description && <GenreDescription text={description} />}
      <p className="filter__count">
        {upcomingCount} artiste{upcomingCount > 1 ? "s" : ""} à venir
      </p>
      {upcomingCount === 0 ? (
        <p className="filter__empty">Tous les sets sont terminés.</p>
      ) : (
        days.map((day) => (
          <section key={day.dayId} className="filter__day">
            <h2>{day.label}</h2>
            <ul className="filter__list">
              {day.sets.map(({ set, status }) => {
                const isFav = favorites.has(slugify(set.artiste));
                const hasMarks = set.incontournable || isFav;
                return (
                  <li key={set.artiste}>
                    <Link to={`/artiste/${slugify(set.artiste)}`}>
                      <span className="filter__time">
                        {set.debut}–{set.fin}
                      </span>
                      <span className="filter__scene">{set.scene}</span>
                      <span className="filter__artist">
                        <span className="filter__name">{set.artiste}</span>
                        {hasMarks && (
                          <span className="filter__marks">
                            {set.incontournable && <PickMark size={16} />}
                            {isFav && <FavoriteMark size={16} />}
                          </span>
                        )}
                        <SetBadge status={status} />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
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
      <Link to="/decouvrir">Retour à la découverte</Link>
    </div>
  );
}
