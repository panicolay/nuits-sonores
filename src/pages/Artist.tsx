import { Link, useParams } from "react-router-dom";
import { getArtistBySlug, getSetStatus, slugify } from "../data/programme";
import { useNow } from "../data/now";
import { SetBadge } from "../components/SetBadge";

export function Artist() {
  const { slug } = useParams();
  const set = slug ? getArtistBySlug(slug) : undefined;
  const now = useNow();

  if (!set) {
    return (
      <div>
        <h1>Artiste introuvable</h1>
        <Link to="/">Retour à l'accueil</Link>
      </div>
    );
  }

  const status = getSetStatus(set, now);

  return (
    <article className="artist">
      <header>
        <h1>{set.artiste}</h1>
        <p className="artist__meta">
          {set.jour} · {set.scene} · {set.debut}–{set.fin}
        </p>
        <SetBadge status={status} />
      </header>

      <p className="artist__description">{set.description}</p>

      {set.incontournable && (
        <aside className="artist__pick" aria-label="Incontournable">
          <span className="artist__pick-mark" aria-hidden>※</span>
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
