import { useEffect, useState } from "react";
import { getDebugNow, setDebugNow, useNow } from "../data/now";
import { forceReload } from "../pwa";

function toLocalInput(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

export function Debug() {
  const now = useNow();
  const overridden = getDebugNow() !== null;
  const [value, setValue] = useState(() => toLocalInput(now));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!overridden) setValue(toLocalInput(now));
  }, [now, overridden]);

  const applyTime = () => {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) setDebugNow(d);
  };

  const onForceReload = async () => {
    setBusy(true);
    setError(null);
    const result = await forceReload();
    if (!result.ok) {
      setBusy(false);
      setError(
        result.reason === "offline"
          ? "Pas de connexion."
          : "Réseau indisponible.",
      );
    }
  };

  return (
    <div className="debug-page">
      <h1>Debug</h1>

      <section className="debug-page__section">
        <h2 className="debug-page__section-title">Heure simulée</h2>
        <div className="debug-page__status">
          <span
            className={`debug-page__indicator${overridden ? " is-fake" : ""}`}
            aria-hidden
          />
          <span>
            {overridden ? "Heure simulée" : "Heure réelle"} —{" "}
            {now.toLocaleString("fr-FR", {
              weekday: "short",
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <input
          type="datetime-local"
          className="debug-page__input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="debug-page__row">
          <button
            type="button"
            className="debug-page__btn"
            onClick={applyTime}
          >
            Appliquer
          </button>
          <button
            type="button"
            className="debug-page__btn"
            onClick={() => setDebugNow(null)}
            disabled={!overridden}
          >
            Revenir au réel
          </button>
        </div>
      </section>

      <section className="debug-page__section">
        <h2 className="debug-page__section-title">Application</h2>
        <p className="debug-page__hint">
          Vide le service worker et le cache, puis recharge la dernière version
          depuis le réseau.
        </p>
        <div className="debug-page__row">
          <button
            type="button"
            className="debug-page__btn"
            onClick={onForceReload}
            disabled={busy}
          >
            {busy ? "Mise à jour…" : "Forcer la mise à jour"}
          </button>
        </div>
        {error && <p className="debug-page__error">{error}</p>}
      </section>
    </div>
  );
}
