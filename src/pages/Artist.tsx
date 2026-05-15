import { Link, useParams } from "react-router-dom";
import { CalendarPlus, Heart, Smiley } from "@phosphor-icons/react";
import { days, getArtistBySlug, getSetStatus, slugify } from "../data/programme";
import { useNow } from "../data/now";
import { toggleFavorite, useFavorites } from "../data/favorites";
import { downloadICS } from "../data/calendar";
import { SetBadge } from "../components/SetBadge";
import { usePageTitle } from "../components/PageTitle";

export function Artist() {
  const { slug } = useParams();
  const set = slug ? getArtistBySlug(slug) : undefined;
  const now = useNow();
  const favorites = useFavorites();

  usePageTitle(set ? set.artiste : "Artiste introuvable");

  if (!set) {
    return (
      <div>
        <h1>Artiste introuvable</h1>
        <Link to="/">Retour à l'accueil</Link>
      </div>
    );
  }

  const status = getSetStatus(set, now);
  const day = days.find((d) => d.date === set.date)!;
  const artistSlug = slugify(set.artiste);
  const fav = favorites.has(artistSlug);

  return (
    <article className="artist">
      <header>
        <h1>{set.artiste}</h1>
        <p className="artist__meta">
          <Link to={`/jour/${day.id}`} className="artist__meta-link">
            {day.label} {set.debut}–{set.fin}
          </Link>
          <span className="artist__meta-sep" aria-hidden> / </span>
          <Link to={`/scene/${slugify(set.scene)}`} className="artist__meta-link">
            {set.scene}
          </Link>
        </p>
        <SetBadge status={status} />
      </header>

      <p className="artist__description">{set.description}</p>

      <div className="artist__actions">
        <button
          type="button"
          className={`artist__favorite${fav ? " is-on" : ""}`}
          onClick={() => toggleFavorite(artistSlug)}
          aria-pressed={fav}
          aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart
            size={18}
            weight={fav ? "fill" : "regular"}
            color="var(--accent-pink)"
            aria-hidden
          />
          <span>{fav ? "Favori" : "Ajouter aux favoris"}</span>
        </button>

        <button
          type="button"
          className="artist__calendar"
          onClick={() => downloadICS(set)}
          aria-label="Ajouter au calendrier"
        >
          <CalendarPlus
            size={18}
            weight="regular"
            color="var(--accent)"
            aria-hidden
          />
          <span>Ajouter au calendrier</span>
        </button>
      </div>

      {set.incontournable && (
        <aside className="artist__pick" aria-label="Incontournable">
          <Smiley
            size={16}
            weight="regular"
            color="var(--accent)"
            className="artist__pick-mark"
            aria-hidden
          />
          <p className="artist__pick-text">{set.incontournable}</p>
        </aside>
      )}

      <section>
        <h2>Genres</h2>
        <ul className="artist__chips">
          {set.genres.map((g) => (
            <li key={g}>
              <Link to={`/filtre/genre/${slugify(g)}`}>{g}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Moods</h2>
        <ul className="artist__chips">
          {set.moods.map((m) => (
            <li key={m}>
              <Link to={`/filtre/mood/${slugify(m)}`}>{m}</Link>
            </li>
          ))}
        </ul>
      </section>

      {set.artistes_lies.length > 0 && (
        <section>
          <h2>Artistes liés</h2>
          <ul className="artist__related">
            {set.artistes_lies.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
